const { Server } = require("socket.io");
const ConversationModel = require("../models/Conversation.model");
const MessageModel = require("../models/Message.model");
const PostModel = require("../models/Post.model");
const UserModel = require("../models/User.model");
const NotificationModel = require("../models/Notification.model");
const sendMessage = require("./events/send-message");
const likePost = require("./events/like-post");
const commentPost = require("./events/comment-post");
const sendFile = require("./events/send-file");

const users = {};

const socketToRoom = {};

const SocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // socket.on("joinUser", (userId) => {
    //   users.push({
    //     id: userId,
    //     socketId: socket.id,
    //   });
    // });

    socket.on("client-join-room", async (roomId) => {
      console.log("connect room", roomId);

      socket.roomId = roomId;
      socket.join(roomId);

      socket.emit("me", roomId);
    });

    socket.on("disconnect", async () => {
      console.log(`User disconnect: ${socket.id}`);
      // if (socket.userId) {
      //   const user = await UserModel.findById(socket.userId);
      //   user.isOnline = false;
      //   user.save();
      // }

      const roomID = socketToRoom[socket.id];
      let room = users[roomID];
      if (room) {
        room = room.filter((id) => id !== socket.id);
        users[roomID] = room;
      }
    });

    socket.on("client-check-online", async (userId) => {
      socket.userId = userId;
      const user = await UserModel.findById(userId);
      // user.isOnline = true;
      // user.save();

      socket.broadcast.to(socket.roomId).emit("server-check-online", user);
    });

    socket.on("client-send-message", sendMessage(io, socket));

    socket.on("client-send-file", sendFile(io, socket));

    socket.on("client-likePost", likePost(io, socket));

    socket.on("client-commentPost", commentPost(io, socket));

    socket.on("client-typing", (data) => {
      socket.broadcast.to(socket.roomId).emit("server-response", data);
    });

    ///Video-call

    socket.on("callUser", ({ signalData }) => {
      io.to(socket.roomId).emit("callUser", {
        signal: signalData,
      });
    });

    socket.on("showMedia", (data) => {
      io.to(socket.roomId).emit("server-showmedia", data);
    });

    // socket.on("updateMyMedia", ({ type, currentMediaStatus }) => {
    //   console.log("updateMyMedia");
    //   socket.broadcast.emit("updateUserMedia", { type, currentMediaStatus });
    // });

    socket.on("answerCall", (data) => {
      // socket.broadcast.emit("updateUserMedia", {
      //   type: data.type,
      //   currentMediaStatus: data.myMediaStatus,
      // });
      io.to(socket.roomId).emit("callAccepted", data);
    });
    socket.on("endCall", ({ id }) => {
      io.to(socket.roomId).emit("endCall");
    });

    //Meeting group
    socket.on("join room", (roomID) => {
      if (users[roomID]) {
        const length = users[roomID].length;
        // if (length === 4) {
        //   socket.emit("room full");
        //   return;
        // }
        users[roomID].push(socket.id);
      } else {
        users[roomID] = [socket.id];
      }
      socketToRoom[socket.id] = roomID;
      const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);

      socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", (payload) => {
      io.to(payload.userToSignal).emit("user joined", {
        signal: payload.signal,
        callerID: payload.callerID,
      });
    });

    socket.on("returning signal", (payload) => {
      io.to(payload.callerID).emit("receiving returned signal", {
        signal: payload.signal,
        id: socket.id,
      });
    });
  });
};

module.exports = SocketServer;
