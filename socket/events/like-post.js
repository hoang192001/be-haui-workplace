const NotificationModel = require("../../models/Notification.model");
const PostModel = require("../../models/Post.model");

module.exports = (io, socket) => async (data) => {
  const { userId, likeType, postId } = data;
  const post = await PostModel.findById(postId);
  const likesArray = post?.likes?.flatMap((item) => item.userLike);
  if (!post) {
    return;
  }

  if (likesArray.includes(userId)) {
    const index = likesArray.indexOf(userId);

    post.likes.splice(index, 1);
    await post.save();

    io.sockets.emit("server-likeToClient", post);
  } else {
    post.likes.push({
      userLike: userId,
      likeType,
    });

    await post.save();

    io.sockets.emit("server-likeToClient", post);

    socket.broadcast.to(socket.roomId).emit("server-notification", data);
  }
};
