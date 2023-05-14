const mongoose = require("mongoose");

const calendarSchema = new mongoose.Schema({
  userIdCreate: { type: mongoose.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  title: String,
  desc: String,
  allDay: {
    type: Boolean,
    default: false,
  },
  start: String,
  end: String,
});

module.exports = mongoose.model("Calendar", calendarSchema);
