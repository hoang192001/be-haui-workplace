const SectionModel = require("../models/Section.model");
const TaskModel = require("../models/Task.model");
const catchAsync = require("../utils/catchAsync");

const createSection = catchAsync(async (req, res) => {
  const { boardId } = req.params;

  const sectionCount = await SectionModel.find().count();
  const section = await SectionModel.create({
    title: `Section Example ${sectionCount > 0 ? sectionCount : 0}`,
    board: boardId,
    position: sectionCount > 0 ? sectionCount : 0,
  });
  section._doc.tasks = [];

  res.status(201).json(section);
});

const updatePositionSection = catchAsync(async (req, res) => {
  const { destinationId, sourceId, boardId } = req.body;
  const sections = await SectionModel.find({
    board: boardId
  }).sort("position");

  const result = [...sections];
  const [removed] = result.splice(sourceId, 1);
  result.splice(destinationId, 0, removed);

  for (let index = 0; index < sections.length; index++) {
    const element = sections[index];
    await SectionModel.updateOne(
      {
        _id: element.id,
      },
      {
        $set: {
          position: result[index].position,
        },
      }
    );
  }

  return res.status(200).json("Update success");
});

const updateSection = catchAsync(async (req, res) => {
  const sectionId = req.params.sectionId;
  const section = await SectionModel.findById(sectionId);

  if (!section) {
    return res.status(400).json("Section does not exists");
  }

  await SectionModel.updateOne(
    {
      _id: sectionId,
    },
    req.body
  );

  return res.status(200).json("Update section success");
});

const deleteSection = catchAsync(async (req, res) => {
  const { sectionId } = req.params;
  const section = await SectionModel.findOne({ _id: sectionId });

  if (!section) return res.status(404).json("Section not found");

  await TaskModel.deleteMany({ sectionId: section.id })
  await SectionModel.deleteOne({ _id: sectionId });

  return res.status(201).json("Delete board success");
});

module.exports = { createSection, updatePositionSection, updateSection, deleteSection };
