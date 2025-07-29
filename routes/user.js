const router = require("express").Router();
const { auth, role } = require("../middlewares/auth");
const {
  getAllAdmins,
  getPendingAdmins,
  approveAdmin,
  getPendingTeachers,
  approveTeacher,
  getPendingStudents,
  approveStudent,
  getUserProfile,
} = require("../controllers/userController");

//Get All Admins
router.get("/admins", auth, role(["super_admin"]), getAllAdmins);

// Super Admin - Approve Admins
router.get("/admins/pending", auth, role(["super_admin"]), getPendingAdmins);
router.put("/admins/:id/approve", auth, role(["super_admin"]), approveAdmin);

// Admin - Approve Teachers and Students
router.get("/teachers/pending", auth, role(["admin"]), getPendingTeachers);
router.put("/teachers/:id/approve", auth, role(["admin"]), approveTeacher);
router.get("/students/pending", auth, role(["admin"]), getPendingStudents);
router.put("/students/:id/approve", auth, role(["admin"]), approveStudent);

router.get("/get-profile", auth, getUserProfile);

module.exports = router;
