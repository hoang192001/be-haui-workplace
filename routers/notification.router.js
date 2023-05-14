const {
  getAllNotification,
  createNotification,
  getCountNewNotification,
  seeAllNotification,
} = require("../controllers/notification.controller");
const verifyToken = require("../middlewares/verifyToken");

const router = require("express").Router();
router.use(verifyToken);

router.get("/", getAllNotification);

router.get("/count", getCountNewNotification);

router.post("/", createNotification);

router.post("/see-all", seeAllNotification);

module.exports = router;
