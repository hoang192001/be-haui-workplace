const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled",
    },
    description: {
      type: String,
      default: `Add description here
    🟢 You can add multiline description
    🟢 Let's start...`,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    favourite: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Board", boardSchema);
