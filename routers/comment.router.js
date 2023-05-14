const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const { getAllComment, createComment, deleteComment, changeComment, getCommentPost } = require("../controllers/comment.controller")
router.use(verifyToken);

router.get("/", getAllComment)

router.get("/:postId", getCommentPost)

router.post("/:postId", createComment)

router.delete("/:postId", deleteComment)

router.patch("/:postId", changeComment)

module.exports = router;