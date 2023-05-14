const CalendarModel = require("../models/Calendar.model");
const UserModel = require("../models/User.model");
const catchAsync = require("../utils/catchAsync");

const getAllEvents = catchAsync(async (req, res) => {
  const userId = req.query.userId;
  console.log(userId);
  const status = await UserModel.findById(userId);
  if (!userId || !status) {
    return res.status(400).json("User does not exist");
  }
  const allEvents = await CalendarModel.find({
    members: { $in: [userId] },
  });

  return res.status(200).json(allEvents);
});

const createEvent = catchAsync(async (req, res) => {
  const { userIdCreate } = req.body;
  const isUser = await UserModel.findById(userIdCreate);
  if (!isUser) {
    return res.status(404).json("User does not exist");
  }

  const newEvent = new CalendarModel({
    userIdCreate,
    ...req.body,
  });

  await newEvent.save();
  return res.status(200).json("Create event success");
});

const changeEvent = catchAsync(async (req, res) => {
  const eventId = req.params.eventId;
  const calendar = await CalendarModel.findById(eventId);
  if (!calendar) {
    return res.status(404).json("Calendar does not exist");
  }

  await CalendarModel.updateOne(
    {
      _id: eventId,
    },
    req.body
  );

  return res.status(200).json("Update event success");
});

const deleteEvent = catchAsync(async (req, res) => {
  const eventId = req.params.eventId;
  const calendar = await CalendarModel.findByIdAndDelete(eventId);
  if (!calendar) {
    return res.status(404).json("Calendar does not exist");
  }
  return res.status(200).json("Delete event success");
});

module.exports = { getAllEvents, createEvent, changeEvent, deleteEvent };
