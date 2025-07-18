const router = require("express").Router();
const { auth, role } = require("../middlewares/auth");
const { createClass } = require("../controllers/classController");

router.post("/create", auth, role(["admin"]), createClass);

module.exports = router;
