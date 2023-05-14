const NotificationModel = require("../../models/Notification.model");

module.exports = (io, socket) => async (data) => {
  const { userId, content, postId } = data;

  // const dataNotification = {
  //   body: "Đã bình luận bài viết của bạn",
  //   from: userId,
  //   to: "63f277e30e2c3675a950ac76",
  //   type: "COMMENT",
  //   link: `/post/${postId}`,
  // };

  // await NotificationModel.create(dataNotification);
  socket.broadcast.to(socket.roomId).emit("server-notification", data);
};
