const router = require("express").Router();
const {
  getAllBoard,
  createBoard,
  getDetailBoard,
  updateBoard,
  deleteBoard,
  inviteUserToBoard,
} = require("../controllers/board.controller");
const verifyToken = require("../middlewares/verifyToken");
router.use(verifyToken);

router.get("/", getAllBoard);

router.post("/", createBoard);

router.post("/invite-user-board", inviteUserToBoard)

router.get("/:boardId", getDetailBoard);

router.patch("/:boardId", updateBoard);

router.delete("/:boardId", deleteBoard);

module.exports = router;
