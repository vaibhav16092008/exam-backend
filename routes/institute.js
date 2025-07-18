const router = require("express").Router();
const { createInstitute } = require("../controllers/instituteController");
const { auth, role } = require("../middlewares/auth");

// Only approved admins can create institutes
router.post("/create", auth, role(["admin"]), createInstitute);

module.exports = router;
