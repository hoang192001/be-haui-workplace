const PostModel = require("../models/Post.model");
const User = require("../models/User.model");
const catchAsync = require("../utils/catchAsync");

const getAllUser = catchAsync(async (req, res) => {
  //
  const query = req.query;
  const allUsers = await User.find({
    fullName: { $regex: new RegExp(query.fullName, "i") },
    _id: { $ne: req.user.id },
  });

  res.status(200).json(allUsers);
});

const getUserById = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).populate("followers");
  if (!userId || !user) {
    return res.status(400).json("User does not exist");
  }

  return res.status(200).json(user);
});

const createUser = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;

  const user_name = await User.findOne({ username });
  if (user_name)
    return res.status(400).json({ msg: "This user name already exists." });

  const user_email = await User.findOne({ email });
  if (user_email)
    return res.status(400).json({ msg: "This email already exists." });

  if (password.length < 6)
    return res
      .status(400)
      .json({ msg: "Password must be at least 6 characters." });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);

  //Create new user
  const newUser = await new User({
    ...req.body,
    password: hashed,
  });

  const user = await newUser.save();
  return res.status(200).json(user);
});

const deleteUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const status = await User.findByIdAndRemove(userId);
  if (!userId || !status) {
    return res.status(400).json("User does not exist");
  }
  return res.status(200).json("Delete success");
});

const changeUser = catchAsync(async (req, res) => {
  const { username, email } = req.body;
  const pathCover = req.files?.cover?.[0].path;
  const pathAvatar = req.files?.avatar?.[0].path;

  const user = await User.findOne({ $or: [{ username }, { _id: req.params.userId }], });
  if (user.id !== req.params.userId) {
    const user_name = await User.findOne({ username });
    if (user_name)
      return res.status(400).json({ msg: "This user name already exists." });

    const user_email = await User.findOne({ email });
    if (user_email)
      return res.status(400).json({ msg: "This email already exists." });
  }

  const userUpdate = await User.findOneAndUpdate(
    { _id: req.params.userId },
    {
      ...req.body,
      avatar: pathAvatar ? pathAvatar : user.avatar,
      avatarCover: pathCover ? pathCover : user.avatarCover,
    },
    { returnOriginal: false }
  );

  return res.status(200).json(userUpdate);
});

const getPostByUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const posts = await PostModel.find({
    userPost: {
      _id: userId,
    },
  })
    .populate({
      path: "userPost",
      select: "-password",
    })
    .populate({
      path: "likes",
      populate: {
        path: "userLike",
        select: "-password",
      },
    })
    .sort("-createdAt");

  return res.status(200).json(posts);
});

const followUser = catchAsync(async (req, res) => {
  const { userId, userFollow } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json("User does not exist");
  }

  if (user.followers.includes(userFollow)) {
    const index = user.followers.indexOf(userFollow);

    user.followers.splice(index, 1);
    await user.save();

    return res.status(200).json("User Unfollow");
  } else {
    user.followers.push(userFollow);

    await user.save();

    return res.status(200).json("User follow");
  }
});

module.exports = {
  getAllUser,
  createUser,
  getUserById,
  deleteUser,
  changeUser,
  getPostByUser,
  followUser,
};
