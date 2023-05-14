const CommentModel = require("../models/Comment.model");
const NotificationModel = require("../models/Notification.model");
const PostModel = require("../models/Post.model");
const catchAsync = require("../utils/catchAsync");

const getAllComment = catchAsync(async (req, res) => {
  const comments = await CommentModel.find();

  return res.status(200).json(comments);
});

const createComment = catchAsync(async (req, res) => {
  const { content, userId } = req.body;
  const postId = req.params.postId;
  const post = await PostModel.findById(postId);

  if (!post) {
    return res.status(404).json("Post does not exist");
  }

  const newComment = new CommentModel({
    content,
    userComment: userId,
    postId,
  });
  post.comments.push(newComment._id);

  if (!userId.includes(post.userPost.toString())) {
    const dataNotification = {
      body: "Đã bình luận bài viết của bạn",
      from: userId,
      to: post.userPost,
      type: "COMMENT",
      link: `/post/${postId}`,
    };

    await NotificationModel.create(dataNotification);
  }

  await post.save();
  await newComment.save();

  return res.status(200).json("Create comment success");
});

const deleteComment = catchAsync(async (req, res) => {
  const { commentId } = req.body;
  const post = await PostModel.findById(req.params.postId);

  if (!commentId) {
    return res.status(404).json("Comment does not exist");
  }

  const postFilter = post.comments.filter((item) => item !== commentId);
  post.comments = postFilter;
  await CommentModel.findByIdAndRemove(commentId);
  await post.save();

  return res.status(200).json("Delete comment success");
});

const changeComment = catchAsync(async (req, res) => {
  const { content, commentId } = req.body;
  const post = await PostModel.findById(req.params.postId);
  const comment = await CommentModel.findById(commentId);

  if (!post) {
    return res.status(404).json("Post does not exist");
  }

  comment.content = content;
  await comment.save();

  return res.status(200).json("Change success");
});

const getCommentPost = catchAsync(async (req, res) => {
  const postId = req.params.postId;

  const comments = await CommentModel.find({ postId }).populate({
    path: "userComment",
    select: "-password",
  }).sort("-createdAt");

  return res.status(200).json(comments);
});

module.exports = {
  getAllComment,
  createComment,
  deleteComment,
  changeComment,
  getCommentPost,
};
