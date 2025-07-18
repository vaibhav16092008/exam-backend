const Institute = require("../models/Institute");
const User = require("../models/User");

const createInstitute = async (req, res) => {
  try {
    const { name, address, logo } = req.body;

    // Only allow admins to create an institute
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can create institutes" });
    }

    // Check if admin already created an institute
    const existing = await Institute.findOne({ adminId: req.user._id });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You have already created an institute" });
    }

    const institute = await Institute.create({
      name,
      address,
      logo,
      adminId: req.user._id,
    });

    // Update admin's user profile with instituteId
    await User.findByIdAndUpdate(req.user._id, {
      instituteId: institute._id,
    });

    res.status(201).json({
      message: "Institute created successfully",
      institute,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createInstitute };
