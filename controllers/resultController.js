const Result = require("../models/Result");

exports.submitResult = async (req, res) => {
  const { examId, answers, score, timeTaken } = req.body;

  const result = new Result({
    examId,
    studentId: req.user._id,
    answers,
    score,
    timeTaken,
    submittedAt: new Date(),
  });

  await result.save();
  res.status(201).json({ message: "Result submitted", result });
};
