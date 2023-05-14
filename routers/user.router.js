const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  getAllUser,
  createUser,
  getUserById,
  deleteUser,
  changeUser,
  getPostByUser,
  followUser
} = require("../controllers/user.controller");
const upload = require("../configs/configMulter");

router.use(verifyToken);
router.use(upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]));

router.get("/", getAllUser);

router.post("/", createUser);

router.get("/:userId", getUserById);

router.delete("/:userId", deleteUser);

router.patch("/:userId", changeUser);

router.get("/post/:userId", getPostByUser);

router.post("/follow", followUser);

module.exports = router;
