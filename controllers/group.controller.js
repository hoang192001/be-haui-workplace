const GroupModel = require("../models/Group.model");
const catchAsync = require("../utils/catchAsync");
const PostModel = require("../models/Post.model");

const getAllGroup = catchAsync(async (req, res) => {
  const groups = await GroupModel.find({
    userGroup: {
      $in: [req.user._id],
    },
  }).populate("userGroup");

  return res.status(200).json(groups);
});

const createGroup = catchAsync(async (req, res) => {
  const { nameGroup, userId } = req.body;
  const imagePath = req.file.path;

  const newGroup = new GroupModel({
    nameGroup,
    avatarGroup: imagePath,
    userCreate: userId,
    userGroup: [userId],
  });

  await newGroup.save();

  return res.status(200).json("Create group success");
});

const getGroupDetail = catchAsync(async (req, res) => {
  const groupId = req.params.groupId;

  const groupDetail = await GroupModel.findById(groupId)
    .populate("userCreate userGroup")
    .populate({
      path: "postGroup",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "groupId",
        select: "nameGroup _id",
      },
    })
    .populate({
      path: "postGroup",
      populate: {
        path: "userPost",
        select: "-password",
      },
    })
    .populate({
      path: "postGroup",
      populate: {
        path: "likes",
        populate: {
          path: "userLike",
          select: "-password",
        },
      },
    });

  res.status(200).json(groupDetail);
});

const deleteGroup = catchAsync(async (req, res) => {
  const groupId = req.params.groupId;
  await GroupModel.findByIdAndRemove(groupId);

  res.status(201).json("Delete group success");
});

const changeGroup = catchAsync(async (req, res) => {
  const { nameGroup } = req.body;
  const avtPath = req.file.path;
  const group = await GroupModel.findById(req.params.groupId);

  if (!group) {
    return res.status(404).json("Group does not exist");
  }
  group.nameGroup = nameGroup;
  group.avatarGroup = avtPath;
  await group.save();
  return res.status(200).json("Update group success");
});

const joinGroup = catchAsync(async (req, res) => {
  const groupDetail = await GroupModel.findById(req.params.groupId);
  const userId = req.user._id;

  if (!groupDetail) {
    return res.status(404).json("Group does not exist");
  }

  if (groupDetail.userGroup.includes(userId)) {
    const index = groupDetail.userGroup.indexOf(userId);

    groupDetail.userGroup.splice(index, 1);
    await groupDetail.save();

    return res.status(200).json("Out group");
  } else {
    groupDetail.userGroup.push(userId);
    await groupDetail.save();
    return res.status(200).json(groupDetail);
  }
});

const getAllGroupNotJoin = catchAsync(async (req, res) => {
  const groups = await GroupModel.find({
    userGroup: {
      $nin: [req.user._id],
    },
    nameGroup: { $regex: new RegExp(req.query.nameGroup, "i") },
  }).populate("userGroup");

  return res.status(200).json(groups);
});

module.exports = {
  getAllGroup,
  createGroup,
  getGroupDetail,
  deleteGroup,
  changeGroup,
  joinGroup,
  getAllGroupNotJoin,
};
