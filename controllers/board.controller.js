const BoardModel = require("../models/Board.model");
const SectionModel = require("../models/Section.model");
const NotificationModel = require("../models/Notification.model");
const TaskModel = require("../models/Task.model");
const catchAsync = require("../utils/catchAsync");

const getAllBoard = catchAsync(async (req, res) => {
  const boards = await BoardModel.find({
    $or: [
      { user: req.user._id },
      {
        members: {
          $in: [req.user._id],
        },
      },
    ],
  });
  res.status(200).json(boards);
});

const createBoard = catchAsync(async (req, res) => {
  const board = await BoardModel.create({
    user: req.user._id,
    members: [req.user._id],
  });
  res.status(201).json(board);
});

const getDetailBoard = catchAsync(async (req, res) => {
  const { boardId } = req.params;
  const board = await BoardModel.findOne({
    _id: boardId,
  }).populate("members");
  const boardMembers = await BoardModel.findOne({
    _id: boardId,
  })

  if (!board) return res.status(404).json("Board not found");

  const memberBoard = boardMembers.members.map(x => x.toString())
  if (!memberBoard.includes(req.user._id.toString())) {
    return res.status(403).json("Not have access");
  }

  const sections = await SectionModel.find({ board: boardId }).sort("position");

  for (const section of sections) {
    const tasks = await TaskModel.find({ sectionId: section.id })
      .populate("sectionId")
      .sort("position");
    section._doc.tasks = tasks;
  }
  board._doc.sections = sections;
  return res.status(200).json(board);
});

const updateBoard = catchAsync(async (req, res) => {
  const boardId = req.params.boardId;
  const board = await BoardModel.findById(boardId);

  if (!board) {
    return res.status(400).json("Board does not exists");
  }

  await BoardModel.updateOne(
    {
      _id: boardId,
    },
    req.body
  );

  return res.status(200).json("Update board success");
});

const deleteBoard = catchAsync(async (req, res) => {
  const { boardId } = req.params;
  const board = await BoardModel.findOne({ user: req.user._id, _id: boardId });

  if (!board) return res.status(404).json("Board not found");
  const sectionsArray = await SectionModel.find({ board: boardId }).sort(
    "position"
  );

  for (const section of sectionsArray) {
    await TaskModel.deleteMany({ sectionId: section.id });
  }
  await SectionModel.deleteMany({ board: boardId });
  await BoardModel.deleteOne({ user: req.user._id, _id: boardId });

  return res.status(201).json("Delete board success");
});

const inviteUserToBoard = catchAsync(async (req, res) => {
  const { boardId, userId } = req.body;

  const board = await BoardModel.findOne({ _id: boardId });

  if (!board) return res.status(404).json("Board not found");

  if (board.members.includes(userId)) {
    const index = board.members.indexOf(userId);

    board.members.splice(index, 1);
    await board.save();
    return res.status(201).json("Delete success");
  } else {
    board.members.push(userId);
    await board.save();
    
    const dataNotification = {
      body: "Đã thêm bạn vào một dự án",
      from: req.user.id,
      to: userId,
      type: "TASK",
      link: `/task/${boardId}`,
    };

    await NotificationModel.create(dataNotification);

    return res.status(201).json("Add user success");
  }
});

module.exports = {
  getAllBoard,
  createBoard,
  getDetailBoard,
  updateBoard,
  deleteBoard,
  inviteUserToBoard,
};
