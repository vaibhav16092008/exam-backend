const router = require("express").Router();
const { auth, role } = require("../middlewares/auth");
const { createExam } = require("../controllers/examController");

router.post("/create", auth, role(["teacher"]), createExam);

module.exports = router;
