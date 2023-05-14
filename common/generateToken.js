const jwt = require("jsonwebtoken");

const createAccessToken = (payload) => {
  const data = {
    id: payload._id,
    isAdmin: payload.isAdmin,
  };

  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "2d" });
};

const createRefreshToken = (payload) => {
  const data = {
    id: payload._id,
    isAdmin: payload.isAdmin,
  };

  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = { createAccessToken, createRefreshToken };
