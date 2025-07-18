const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/class", require("./routes/class"));
app.use("/api/subject", require("./routes/subject"));
app.use("/api/exam", require("./routes/exam"));
app.use("/api/result", require("./routes/result"));
app.use("/api/leaderboard", require("./routes/leaderboard"));
app.use("/api/institute", require("./routes/institute"));

// Connect DB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server started");
    })
  )
  .catch((err) => console.error(err));
