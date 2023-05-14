const router = require("express").Router();
const {
  createTask,
  updatePositionTask,
  getTaskById,
  deleteTask,
  updateTaskWork,
} = require("../controllers/task.controller");
const verifyToken = require("../middlewares/verifyToken");
router.use(verifyToken);

router.get("/");

router.post("/", createTask);

router.post("/update-position/:boardId", updatePositionTask);

router.get("/:taskId", getTaskById);

router.delete("/:taskId", deleteTask);

router.patch("/:taskId", updateTaskWork);

module.exports = router;
