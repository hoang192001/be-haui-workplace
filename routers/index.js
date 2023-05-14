const express = require("express");
const router = express.Router();
const userRouter = require("./user.router");
const authRouter = require("./auth.router");
const postRouter = require("./post.router");
const commentRouter = require("./comment.router");
const groupRouter = require("./group.router");
const messageRouter = require("./message.router");
const calendarRouter = require("./calendar.router");
const taskRouter = require("./task.router");
const boardRouter = require("./board.router");
const sectionRouter = require("./section.router");
const notificationRouter = require("./notification.router");

const defaultRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },
];

const protectRoutes = [
  {
    path: "/users",
    route: userRouter,
  },
  {
    path: "/posts",
    route: postRouter,
  },
  {
    path: "/comments",
    route: commentRouter,
  },
  {
    path: "/groups",
    route: groupRouter,
  },
  {
    path: "/messages",
    route: messageRouter,
  },
  {
    path: "/calendars",
    route: calendarRouter,
  },
  {
    path: "/tasks",
    route: taskRouter,
  },
  {
    path: "/boards",
    route: boardRouter,
  },
  {
    path: "/sections",
    route: sectionRouter,
  },
  {
    path: "/notifications",
    route: notificationRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

protectRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
