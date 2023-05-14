const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Task default",
    },
    sectionId: { type: mongoose.Types.ObjectId, ref: "Section" },
    userPerform: { type: mongoose.Types.ObjectId, ref: "User" },
    timeDeadline: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: `Add description here
    🟢 You can add multiline description
    🟢 Let's start...`,
    },
    members: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    priority: {
      type: String,
      default: "",
    },
    position: {
      type: Number,
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
