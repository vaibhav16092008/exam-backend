const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Get all Admins
exports.getAllUsers = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const filter = { role: req.query.role };

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate({
      path: "approvedBy",
      select: "name email",
    });

  res.json({
    total,
    page,
    limit,
    users,
  });
};
// Super Admin Approval
exports.getPendingAdmins = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const filter = { role: "admin", isApproved: false };

    const total = await User.countDocuments(filter);
    const admins = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // optional: newest first

    res.json({
      total, // total count of pending admins
      page,
      limit,
      admins, // paginated data
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch pending admins", error: err.message });
  }
};

exports.approveOrRejectAdmin = async (req, res) => {
  const { isApproved } = req.body; // true or false

  try {
    if (isApproved === true) {
      // Approve user
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

      // Send approval email
      await sendEmail(
        user.email,
        "Account Approved ✅",
        `<h3>Hello ${user.name},</h3>
        <p>Your account has been approved. You can now log in and access your dashboard.</p>
        <p>Thank you!</p>`
      );

      return res.json({ message: "Admin approved and email sent", user });
    } else {
      // Reject user - delete user
      const user = await User.findByIdAndDelete(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Send rejection email (optional)
      await sendEmail(
        user.email,
        "Account Rejected ❌",
        `<h3>Hello ${user.name},</h3>
        <p>We regret to inform you that your admin account request has been rejected.</p>
        <p>If you think this was a mistake, please contact support.</p>`
      );

      return res.json({ message: "Admin rejected and user deleted" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Action failed", details: err.message });
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

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .populate("instituteId", "name") // Institute ka sirf name
      .populate("classId", "name") // Class ka sirf name
      .populate("approvedBy", "name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
