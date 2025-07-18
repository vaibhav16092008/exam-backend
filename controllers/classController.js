const Class = require("../models/Class");

exports.createClass = async (req, res) => {
  const newClass = new Class({
    name: req.body.name,
    instituteId: req.user.instituteId,
    assignedTeachers: [],
  });
  await newClass.save();
  res.status(201).json(newClass);
};
