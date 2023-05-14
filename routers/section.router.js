const router = require("express").Router();
const {
  createSection,
  updatePositionSection,
  updateSection,
  deleteSection,
} = require("../controllers/section.controller");
const verifyToken = require("../middlewares/verifyToken");

router.use(verifyToken);

router.post("/:boardId", createSection);

router.post("/update-position/:boardId", updatePositionSection);

router.patch("/:sectionId", updateSection);

router.delete("/:sectionId", deleteSection);

module.exports = router;
