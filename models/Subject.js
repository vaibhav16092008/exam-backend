const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: String,
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute" },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Subject", subjectSchema);
