const router = require("express").Router();
const {
  register,
  login,
  updateAccessToken,
  logout,
  sendCodeMailReset,
  confirmCodeMail,
  changePassword,
} = require("../controllers/auth.controller");

router.post("/register", register);

router.post("/login", login);

router.post("/refreshToken", updateAccessToken);

router.post("/logout", logout);

router.post("/sendCodeMail", sendCodeMailReset);

router.post("/confirmCode", confirmCodeMail);

router.post("/forgot-password", changePassword);

module.exports = router;
