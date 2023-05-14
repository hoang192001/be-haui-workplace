const Users = require("../models/User.model");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    const accessToken = token.split(" ")[1];
    if (!token) return res.status(400).json({ msg: "Invalid Authentication." });

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(400).json({ msg: "Invalid Authentication." });

    const user = await Users.findOne({ _id: decoded.id });

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json("Server Internal Error");
  }
};

module.exports = verifyToken;
