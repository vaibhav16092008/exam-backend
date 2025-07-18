const mongoose = require("mongoose");

const instituteSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    logo: String,
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Institute", instituteSchema);
