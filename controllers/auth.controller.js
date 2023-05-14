const User = require("../models/User.model");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  createAccessToken,
  createRefreshToken,
} = require("../common/generateToken");
const { sendPasswordReset } = require("../services/emailProvider");
const { generateCode } = require("../common/createResetPassword");
const MailModel = require("../models/Mail.model");

const register = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;

  if (username) {
    const user_name = await User.findOne({ username });
    if (user_name)
      return res.status(400).json({ msg: "This user name already exists." });
  }

  if (email) {
    const user_email = await User.findOne({ email });
    if (user_email)
      return res.status(400).json({ msg: "This email already exists." });
  }

  if (password.length < 6)
    return res
      .status(400)
      .json({ msg: "Password must be at least 6 characters." });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);

  //Create new user
  const newUser = new User({
    ...req.body,
    fullName: username || email,
    email: email !== "" ? email : "none",
    username: username !== "" ? username : "none",
    password: hashed,
  });

  const access_token = createAccessToken(newUser);
  const refresh_token = createRefreshToken(newUser);

  res.cookie("refreshToken", refresh_token, {
    httpOnly: true,
    path: "/api/v1/auth/refreshToken",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: "strict", // 30days
  });

  //Save user to DB
  const user = await newUser.save();
  return res.status(200).json({
    user,
    access_token,
  });
});

const login = catchAsync(async (req, res) => {
  const { username, email } = req.body;

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) {
    return res.status(404).json("Incorrect username");
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    res.status(404).json("Incorrect password");
  }

  const access_token = createAccessToken(user);
  const refresh_token = createRefreshToken(user);

  res.cookie("refreshToken", refresh_token, {
    httpOnly: true,
    path: "/api/v1/auth/refreshToken",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  });

  return res.status(200).json({
    user,
    access_token,
  });
});

const updateAccessToken = catchAsync(async (req, res) => {
  const rf_token = req.cookies.refreshToken;
  if (!rf_token) return res.status(400).json({ msg: "Please login now." });

  jwt.verify(rf_token, process.env.JWT_SECRET, async (err, result) => {
    if (err) return res.status(400).json({ msg: "Please login now." });

    const user = await User.findById(result.id).select("-password");

    if (!user) return res.status(400).json({ msg: "This does not exist." });

    const access_token = createAccessToken({ id: result.id });

    return res.json({
      access_token,
      user,
    });
  });
});

const logout = catchAsync(async (req, res) => {
  res.clearCookie("refreshToken", { path: "/api/v1/auth/refreshToken" });
  return res.json({ msg: "Logged out!" });
});

const sendCodeMailReset = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).exec();

  if (!user) {
    res.status(400).json("No account found with that email");
  }

  const confirmCode = generateCode(8);
  let mail = new MailModel({
    fromEmail: process.env.MAIL_USER,
    toEmail: email,
    subject: "Reset password",
    message: `Your reset password code is: ${confirmCode}`,
    confirmCode,
  });
  mail.save();
  await sendPasswordReset(mail);
  return res.status(200).json("success");
});

const confirmCodeMail = catchAsync(async (req, res) => {
  const { confirmCode } = req.body;
  const mail = await MailModel.findOneAndRemove({ confirmCode });
  if (!confirmCode || !mail) {
    return res.status(400).json("Verification code is incorrect");
  }
  return res.status(200).json("Verification successful");
});

const changePassword = catchAsync(async (req, res) => {
  const { username, password, newPassword, confirmCode } = req.body;

  if (!username || !newPassword) {
    return res.status(400).json("Not enough information");
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json("User does not exist")
  }
  if (!confirmCode) {
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json("Incorrect password");
    }
  } else {
    const mail = await MailModel.findOneAndRemove({ confirmCode }).exec();
    if (!mail) {
      return res.status(400).json("Verification code is incorrect");
    }
  }
  //Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPassword, salt);
  user.password = hashed;
  await user.save();
  return res.status(200).json("Change password successful");
});

module.exports = {
  register,
  login,
  updateAccessToken,
  logout,
  sendCodeMailReset,
  confirmCodeMail,
  changePassword,
};
