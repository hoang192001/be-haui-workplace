const APIfeatures = require("../common/ApiFeature");
const GroupModel = require("../models/Group.model");
const NotificationModel = require("../models/Notification.model");
const PostModel = require("../models/Post.model");
const UserModel = require("../models/User.model");
const catchAsync = require("../utils/catchAsync");

const getAllPost = catchAsync(async (req, res) => {

  const feature = new APIfeatures(
    PostModel.find(), req.query
  ).paginating()

  const posts = await feature.model
    .populate("groupId", "nameGroup _id")
    .populate({
      path: "userPost",
      select: "-password",
    })
    .populate({
      path: "likes",
      populate: {
        path: "userLike",
        select: "-password",
      },
    })
    .sort("-createdAt");

  return res.status(200).json(posts);
});

const createPost = catchAsync(async (req, res) => {
  const { userId, content } = req.body;

  const images = req.files.flatMap((item) => item.path);
  const isUser = await UserModel.findById(userId);
  if (!isUser) {
    return res.status(404).json("User does not exist");
  }
  const newPost = new PostModel({
    userPost: userId,
    content,
    images,
  });

  await newPost.save();
  return res.status(200).json("Create post success");
});

const getPostDetail = catchAsync(async (req, res) => {
  const postDetail = await PostModel.findById(req.params.postId)
    .populate("groupId", "nameGroup _id")
    .populate({
      path: "userPost",
      select: "-password",
    })
    .populate({
      path: "likes",
      populate: {
        path: "userLike",
        select: "-password",
      },
    })
    .populate({
      path: "comments",
      populate: {
        path: "userComment",
        select: "-password",
      },
    });

  if (!postDetail) {
    return res.status(404).json("Post does not exist");
  }

  res.status(200).json(postDetail);
});

const deletePost = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  await PostModel.findByIdAndRemove(postId);

  if (!postId) {
    return res.status(404).json("Post does not exist");
  }

  return res.status(200).json("Delete success");
});

const changePost = catchAsync(async (req, res) => {
  const images = req.files.flatMap((item) => item.path);
  const post = await PostModel.findById(req.params.postId);

  if (!post) {
    return res.status(404).json("Post does not exist");
  }

  await PostModel.updateOne(
    {
      _id: req.params.postId,
    },
    {
      ...req.body,
      images: images ? images : post.images
    }
  );

  return res.status(200).json("Change post success");
});

const likeUnlikePost = catchAsync(async (req, res) => {
  const { userId, likeType } = req.body;
  const post = await PostModel.findById(req.params.postId);
  const likesArray = post?.likes?.flatMap((item) => item.userLike);
  if (!post) {
    return res.status(404).json("Post does not exist");
  }

  if (likesArray.includes(userId)) {
    const index = likesArray.indexOf(userId);

    post.likes.splice(index, 1);
    await post.save();

    return res.status(200).json("Post Unliked");
  } else {
    post.likes.push({
      userLike: userId,
      likeType,
    });

    if (!userId.includes(post.userPost.toString())) {
      const dataNotification = {
        body: "Đã like bài viết của bạn",
        from: userId,
        to: post.userPost,
        type: "LIKE",
        link: `/post/${post._id}`,
      };

      await NotificationModel.create(dataNotification);
    }
    await post.save();

    return res.status(200).json("Post Liked");
  }
});

const postInGroup = catchAsync(async (req, res) => {
  const { userId, content, groupId } = req.body;

  const group = await GroupModel.findById(groupId);

  if (!group.userGroup.includes(userId)) {
    return res.status(404).json("User not in the group");
  }
  const images = req.files.flatMap((item) => item.path);

  const newPost = new PostModel({
    userPost: userId,
    content,
    images,
    groupId,
  });
  group.postGroup.push(newPost._id);
  await newPost.save();
  await group.save();
  return res.status(200).json("Create post success");
});

module.exports = {
  getAllPost,
  createPost,
  getPostDetail,
  deletePost,
  changePost,
  likeUnlikePost,
  postInGroup,
};
