const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  examLeaderboard,
  classLeaderboard,
  instituteLeaderboard,
} = require("../controllers/leaderboardController");
router.get("/exam/:examId", auth, examLeaderboard);
router.get("/class/:classId", auth, classLeaderboard);
router.get("/institute/:instituteId", auth, instituteLeaderboard);

module.exports = router;
