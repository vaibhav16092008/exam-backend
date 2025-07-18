const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  answers: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      selectedOption: Number,
      isCorrect: Boolean,
    },
  ],
  score: Number,
  timeTaken: Number,
  submittedAt: Date,
});

module.exports = mongoose.model("Result", resultSchema);
