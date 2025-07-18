const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  title: String,
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  questions: [mongoose.Schema.Types.ObjectId],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  duration: Number,
  startTime: Date,
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Exam", examSchema);
