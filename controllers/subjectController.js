const Subject = require("../models/Subject");

exports.createSubject = async (req, res) => {
  const { name, classId, assignedTo } = req.body;

  const subject = new Subject({
    name,
    instituteId: req.user.instituteId,
    classId,
    assignedTo,
  });

  await subject.save();
  res.status(201).json(subject);
};
