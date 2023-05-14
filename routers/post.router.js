const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../configs/configMulter");
const { getAllPost, createPost, getPostDetail, deletePost, likeUnlikePost, changePost, postInGroup } = require("../controllers/post.controller");

router.use(verifyToken);
router.use(upload.array("file", 5))

router.get("/", getAllPost);

router.post("/", createPost);

router.post("/post-group", postInGroup);

router.get("/:postId", getPostDetail);

router.delete("/:postId", deletePost);

router.patch("/:postId", changePost);

router.post("/like/:postId", likeUnlikePost);


module.exports = router;
