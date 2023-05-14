const upload = require("../../configs/configMulter");
const ConversationModel = require("../../models/Conversation.model");
const MessageModel = require("../../models/Message.model");
const UserModel = require("../../models/User.model");

const fs = require("fs/promises");

module.exports = (io, socket) => async (data) => {
  const { conversationId, fromUserId, file, fileName } = data;

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

  await fs.writeFile(`uploads/${fileName}`, file);

  const messageModel = await MessageModel.create({
    conversationId: conversation._id,
    author: user._id,
    payload: {
      type: "image",
      body: `uploads/${fileName}`,
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
