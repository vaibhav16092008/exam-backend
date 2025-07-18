const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: String,
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute" },
  assignedTeachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Class", classSchema);
