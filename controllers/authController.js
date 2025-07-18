const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, instituteId, classId } = req.body;

    // Duplicate email check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, Please Login!" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      role,
      instituteId: instituteId || null,
      classId: classId || null,
      isApproved: role === "super_admin",
    });

    await user.save();

    res.status(201).json({
      message:
        role === "super_admin"
          ? "Registration successful"
          : "Registration successful, pending approval",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isApproved)
      return res
        .status(403)
        .json({ message: "Your account approval is still pending." });

    // ✅ Check role only if it's provided in request
    if (role && user.role !== role) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login Successful!",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", details: err.message });
  }
};
