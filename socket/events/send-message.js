const ConversationModel = require("../../models/Conversation.model");
const MessageModel = require("../../models/Message.model");
const UserModel = require("../../models/User.model");

module.exports = (io, socket) => async (data) => {
  const { conversationId, fromUserId, message } = data;

  const conversation = await ConversationModel.findById(conversationId);
  const checkUserConversation = await ConversationModel.findOne({
    members: {
      $in: fromUserId,
    },
  });
  if (!conversation || !checkUserConversation) {
    return;
  }

  const user = await UserModel.findById(fromUserId);

  const messageModel = await MessageModel.create({
    conversationId: conversation._id,
    author: user._id,
    payload: {
      type: "text",
      body: message,
    },
  });

  conversation.newMessage = messageModel._id;

  await conversation.save();
  const messageChat = await MessageModel.findById(messageModel._id).populate({
    path: "author",
    select: "fullName avatar",
  });

  io.to(socket.roomId).emit("server-send-message", messageChat);
};
