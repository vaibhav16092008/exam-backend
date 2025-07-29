const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Get all Admins
exports.getAllAdmins = async (req, res) => {
  const admins = await User.find({ role: "admin" });
  res.json(admins);
};
// Super Admin Approval
exports.getPendingAdmins = async (req, res) => {
  const admins = await User.find({ role: "admin", isApproved: false });
  res.json(admins);
};

exports.approveAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isApproved: true,
        approvedBy: req.user._id,
      },
      { new: true }
    );

    // Check if user exists and is updated
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send approval email
    await sendEmail(
      user.email,
      "Account Approved ✅",
      `<h3>Hello ${user.name},</h3>
      <p>Your account has been approved. You can now log in and access your dashboard.</p>
      <p>Thank you!</p>`
    );

    res.json({ message: "Admin approved and email sent", user });
  } catch (err) {
    res.status(500).json({ message: "Approval failed", details: err.message });
  }
};

// Admin Approves Teachers
exports.getPendingTeachers = async (req, res) => {
  const teachers = await User.find({
    role: "teacher",
    instituteId: req.user.instituteId,
    isApproved: false,
  });
  res.json(teachers);
};

exports.approveTeacher = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isApproved: true,
        approvedBy: req.user._id,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send approval email to teacher
    await sendEmail(
      user.email,
      "Teacher Account Approved ✅",
      `<h3>Hello ${user.name},</h3>
      <p>Your teacher account has been approved. You can now log in and start using the system.</p>
      <p>Regards,<br/>Team</p>`
    );

    res.json({ message: "Teacher approved and email sent", user });
  } catch (err) {
    res.status(500).json({ error: "Approval failed", details: err.message });
  }
};

// Admin Approves Students
exports.getPendingStudents = async (req, res) => {
  const students = await User.find({
    role: "student",
    instituteId: req.user.instituteId,
    isApproved: false,
  });
  res.json(students);
};

exports.approveStudent = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isApproved: true,
        approvedBy: req.user._id,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send approval email to student
    await sendEmail(
      user.email,
      "Student Account Approved ✅",
      `<h3>Hello ${user.name},</h3>
      <p>Your student account has been approved. You can now log in and participate in exams and other activities.</p>
      <p>All the best!<br/>Team</p>`
    );

    res.json({ message: "Student approved and email sent", user });
  } catch (err) {
    res.status(500).json({ message: "Approval failed", details: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate("instituteId", "name")
      .populate("classId", "name")
      .populate("approvedBy", "name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User Frofile Fetched Successfully! ",
      user,
    });
  } catch (err) {
    console.error("Error in getUserProfile:", err);
    res.status(500).json({
      message: "Server Error",
      details: err,
    });
  }
};
