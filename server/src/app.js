const express = require("express");
const cors = require("cors");
const onboardingRoutes = require("./routes/onboarding.routes");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/onboarding", onboardingRoutes);

app.get("/", (req, res) => {
  res.send("Student Tracker Backend Running 🚀");
});

module.exports = app;
