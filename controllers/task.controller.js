const catchAsync = require("../utils/catchAsync");
const SectionModel = require("../models/Section.model");
const TaskModel = require("../models/Task.model");

const getAllTaskUser = catchAsync(async (req, res) => {});

const createTask = catchAsync(async (req, res) => {
  const { sectionId } = req.body;
  const section = await SectionModel.findById(sectionId);

  if (!section) {
    return res.status(400).json("Section does not exists");
  }

  const tasksCount = await TaskModel.find({ section: sectionId }).count();
  const task = await TaskModel.create({
    sectionId: section._id,
    position: tasksCount > 0 ? tasksCount : 0,
  });
  task.sectionId = section._id;
  return res.status(201).json(task);
});

const updatePositionTask = catchAsync(async (req, res) => {
  const {
    resourceList,
    destinationList,
    resourceSectionName,
    destinationSectionName,
  } = req.body;
  const sectionResource = await SectionModel.find({
    title: resourceSectionName,
  });
  const sectionDestination = await SectionModel.find({
    title: destinationSectionName,
  });
  if (resourceSectionName !== destinationSectionName) {
    for (let index = 0; index < destinationList.length; index++) {
      const element = destinationList[index];
      await TaskModel.updateOne(
        {
          _id: element._id,
        },
        {
          $set: {
            sectionId: sectionDestination[0]._id,
            position: index,
          },
        }
      );
    }
  }
  for (let index = 0; index < resourceList.length; index++) {
    const element = resourceList[index];
    await TaskModel.updateOne(
      {
        _id: element._id,
      },
      {
        $set: {
          sectionId: sectionResource[0]._id,
          position: index,
        },
      }
    );
  }
  return res.status(200).json("updated");
});

const getTaskById = catchAsync(async (req, res) => {
  const taskId = req.params.taskId;

  const task = await TaskModel.findById(taskId);

  if (!task) {
    return res.status(400).json("Task does not exists");
  }

  return res.status(201).json(task);
});

const deleteTask = catchAsync(async (req, res) => {
  const taskId = req.params.taskId;
  const task = await TaskModel.findByIdAndDelete(taskId);
  if (!task) {
    return res.status(400).json("Task does not exists");
  }
  return res.status(200).json("Delete task success");
});

const updateTaskWork = catchAsync(async (req, res) => {
  const taskId = req.params.taskId;
  const task = await TaskModel.findById(taskId);

  if (!task) {
    return res.status(400).json("Task does not exists");
  }

  await TaskModel.updateOne(
    {
      _id: taskId,
    },
    req.body
  );

  return res.status(200).json("Update task success");
});

module.exports = {
  getAllTaskUser,
  createTask,
  updatePositionTask,
  getTaskById,
  deleteTask,
  updateTaskWork,
};
