const router = require("express").Router();
const { auth, role } = require("../middlewares/auth");
const { createSubject } = require("../controllers/subjectController");

router.post("/create", auth, role(["admin"]), createSubject);

module.exports = router;
