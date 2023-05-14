const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.ObjectId,
      ref: "Conversation",
      required: [true, "Requires conventionId"],
    },
    author: { type: mongoose.Schema.ObjectId, ref: "User" },
    payload: {
      type: {
        type: String,
        enum: ["text", "image", "file"],
        required: [true, "Requires type"],
      },
      body: {
        type: String,
        required: [true, "Requires body"],
      },
      fileName: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
