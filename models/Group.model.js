const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    nameGroup: String,
    avatarGroup: String,
    userCreate: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    postGroup: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Post",
      },
    ],
    userGroup: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Group", groupSchema);
