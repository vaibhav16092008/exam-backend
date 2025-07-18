const Result = require("../models/Result");
const User = require("../models/User");

exports.examLeaderboard = async (req, res) => {
  const data = await Result.find({ examId: req.params.examId })
    .sort({ score: -1, timeTaken: 1 })
    .populate("studentId", "name");
  res.json(data);
};

exports.classLeaderboard = async (req, res) => {
  const students = await User.find({ classId: req.params.classId });
  const ids = students.map((s) => s._id);
  const data = await Result.find({ studentId: { $in: ids } })
    .sort({ score: -1, timeTaken: 1 })
    .populate("studentId", "name");
  res.json(data);
};

exports.instituteLeaderboard = async (req, res) => {
  const students = await User.find({
    instituteId: req.params.instituteId,
    role: "student",
  });
  const ids = students.map((s) => s._id);
  const data = await Result.find({ studentId: { $in: ids } })
    .sort({ score: -1, timeTaken: 1 })
    .populate("studentId", "name");
  res.json(data);
};
