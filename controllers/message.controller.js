const ConversationModel = require("../models/Conversation.model");
const MessageModel = require("../models/Message.model");
const UserModel = require("../models/User.model");
const catchAsync = require("../utils/catchAsync");

const getAllConversation = catchAsync(async (req, res) => {
  const { userId } = req.query;

  const conversations = await ConversationModel.find({
    members: { $in: [userId] },
  })
    .populate("members")
    .populate({
      path: "newMessage",
      populate: {
        path: "author",
        select: "_id fullName",
      },
    })
    .sort({
      "updatedAt": -1,
    });

  return res.status(200).json(conversations);
});

const createConversation = catchAsync(async (req, res) => {
  const { typeConversation, nameGroup, from, to, members } = req.body;
  const oldConversation = await ConversationModel.findOne({
    from: {
      $in: [from, to],
    },
    to: {
      $in: [from, to],
    },
    members: {
      $in: [from, to],
    },
  }).populate("members");

  if (oldConversation && typeConversation === "private") {
    return res.status(201).json("The conversation already exists");
  } else {
    const newConversation = await ConversationModel.create({
      typeConversation,
      nameGroup,
      from,
      to,
      members,
    });

    return res.status(200).json(newConversation);
  }
});

const createMessage = catchAsync(async (req, res) => {
  const { conversationId, fromUserId, message } = req.body;

  const conversation = await ConversationModel.findById(conversationId);
  const checkUserConversation = await ConversationModel.findOne({
    members: {
      $in: fromUserId,
    },
  });
  if (!conversation || !checkUserConversation) {
    return res.status(404).json("Not found conversation");
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

  return res.status(200).json("Send message success");
});

const getMessagesByConversation = catchAsync(async (req, res) => {
  const conversationId = req.params.conversationId;
  const conversation = await ConversationModel.findById(conversationId);

  if (!conversation) {
    return res.status(404).json("Not found conversation");
  }

  const messages = await MessageModel.find({ conversationId }).populate({
    path: "author",
    select: "fullName avatar",
  });

  return res.status(200).json(messages);
});

const getConversationById = catchAsync(async (req, res) => {
  const conversationId = req.params.conversationId;
  const conversation = await ConversationModel.findById(
    conversationId
  ).populate("members newMessage");
  if (!conversation) {
    return res.status(404).json("Not found conversation");
  }
  return res.status(200).json(conversation);
});

const deleteConversation = catchAsync(async (req, res) => {
  const conversationId = req.params.conversationId;
  const conversation = await ConversationModel.findByIdAndDelete(
    conversationId
  );
  if (!conversation) {
    return res.status(404).json("Not found conversation");
  }
  return res.status(200).json("Delete success");
});

const deleteOrAddMemberGroup = catchAsync(async (req, res) => {
  const { userId, type } = req.body;
  const conversationId = req.params.conversationId;
  const conversation = await ConversationModel.findById(conversationId);

  if (!conversation) {
    return res.status(404).json("Not found conversation");
  }

  if (type === "ADD") {
    conversation.members = [...conversation.members, userId];
  } else {
    conversation.members = conversation.members.filter(
      (item) => item !== userId
    );
  }
  conversation.save();
  return res.status(200).json(conversation);
});

const changeConversation = catchAsync(async (req, res) => {
  const conversationId = req.params.conversationId;
  const conversation = await ConversationModel.findById(conversationId);
  const pathAvatar = req?.file?.path;

  if (!conversation) {
    return res.status(404).json("Not found conversation");
  }

  const conversationUpdate = await ConversationModel.findOneAndUpdate(
    { _id: conversationId },
    {
      ...req.body,
      avatarGroup: pathAvatar ? pathAvatar : conversation.avatarGroup,
    },
    { returnOriginal: false }
  );
  return res.status(200).json(conversationUpdate);
});

module.exports = {
  getAllConversation,
  createConversation,
  createMessage,
  getMessagesByConversation,
  getConversationById,
  deleteOrAddMemberGroup,
  deleteConversation,
  changeConversation,
};
