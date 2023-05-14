const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    typeConversation: {
      type: String,
      enum: ["private", "group"],
      default: "private",
      required: [true, "Requires type conversation"],
    },
    nameGroup: {
      type: String,
    },
    avatarGroup: {
      type: String,
      default: "uploads\\defaul-avt-user.jpg",
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    members: {
      type: Array,
      required: [true, "Requires members"],
      ref: "User",
    },
    newMessage: { type: mongoose.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
