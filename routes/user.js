const router = require("express").Router();
const { auth, role } = require("../middlewares/auth");
const {
  getPendingAdmins,
  approveOrRejectAdmin,
  getPendingTeachers,
  approveTeacher,
  getPendingStudents,
  approveStudent,
  getUserProfile,
  getAllUsers,
  getUserById,
} = require("../controllers/userController");

//Get All Admins
router.get("/all", auth, role(["super_admin"]), getAllUsers);
router.get("/:id", auth, getUserById);

// Super Admin - Approve Admins
router.get("/admins/pending", auth, role(["super_admin"]), getPendingAdmins);
router.put(
  "/admins/:id/approval",
  auth,
  role(["super_admin"]),
  approveOrRejectAdmin
);

// Admin - Approve Teachers and Students
router.get("/teachers/pending", auth, role(["admin"]), getPendingTeachers);
router.put("/teachers/:id/approve", auth, role(["admin"]), approveTeacher);
router.get("/students/pending", auth, role(["admin"]), getPendingStudents);
router.put("/students/:id/approve", auth, role(["admin"]), approveStudent);

router.get("/get-profile", auth, getUserProfile);

module.exports = router;
