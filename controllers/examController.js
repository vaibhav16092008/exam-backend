const Exam = require("../models/Exam");
const Subject = require("../models/Subject");

exports.createExam = async (req, res) => {
  const { title, classId, subjectId, questions, duration, startTime } =
    req.body;

  const subject = await Subject.findOne({
    _id: subjectId,
    assignedTo: req.user._id,
  });
  if (!subject || subject.classId.toString() !== classId) {
    return res
      .status(403)
      .json({ message: "You're not allowed to create exams for this subject" });
  }

  const exam = new Exam({
    title,
    classId,
    subjectId,
    questions,
    createdBy: req.user._id,
    duration,
    startTime,
  });

  await exam.save();
  res.status(201).json(exam);
};
