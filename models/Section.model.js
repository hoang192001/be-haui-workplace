const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    title: {
      type: String,
      default: "Section Example",
    },
    position: {
      type: Number,
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Section", sectionSchema);
