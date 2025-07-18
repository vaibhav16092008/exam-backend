const router = require("express").Router();
const { auth, role } = require("../middlewares/auth");
const { submitResult } = require("../controllers/resultController");

router.post("/submit", auth, role(["student"]), submitResult);

module.exports = router;
