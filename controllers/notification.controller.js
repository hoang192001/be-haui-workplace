const NotificationModel = require("../models/Notification.model");
const catchAsync = require("../utils/catchAsync");

const getAllNotification = catchAsync(async (req, res) => {
  const notifications = await NotificationModel.find({
    to: req.user._id,
  })
    .populate("from")
    .sort({
      createdAt: -1,
    });

  return res.status(201).json(notifications);
});

const getCountNewNotification = catchAsync(async (req, res) => {
  const notifications = await NotificationModel.find({
    viewStatus: false,
    to: req.user._id,
  }).count();

  return res.status(201).json({
    count: notifications,
  });
});

const seeAllNotification = catchAsync(async (req, res) => {
  await NotificationModel.updateMany({
    viewStatus: true,
  });

  return res.status(201).json("See all");
});

const createNotification = catchAsync(async (req, res) => {
  await NotificationModel.create(req.body);

  return res.status(200).json("Create success");
});

module.exports = {
  getAllNotification,
  createNotification,
  getCountNewNotification,
  seeAllNotification
};
