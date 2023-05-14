const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: String,
    images: {
      type: Array,
      required: true,
    },
    likes: [
      {
        userLike: {
          type: String,
          ref: "User",
        },
        likeType: String,
      },
    ],
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
    userPost: { type: mongoose.Types.ObjectId, ref: "User" },
    groupId: { type: mongoose.Types.ObjectId, ref: "Group" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
