const router = require("express").Router();
const { createEvent, getAllEvents, changeEvent, deleteEvent } = require("../controllers/calendar.controller");
const verifyToken = require("../middlewares/verifyToken");

router.use(verifyToken);

router.get("/", getAllEvents);

router.post("/", createEvent);

router.patch("/:eventId", changeEvent);

router.delete("/:eventId", deleteEvent);

module.exports = router;
