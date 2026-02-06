const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
  completedAt: Date,
});

const DaySchema = new mongoose.Schema({
  day: Number,
  date: Date,
  tasks: [TaskSchema],
  isCompleted: { type: Boolean, default: false },
  backlog: { type: Boolean, default: false },
});

const RoadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  topic: String,
  duration: Number,
  startDate: Date,
  status: { type: String, default: "active" },
  days: [DaySchema],
  streak: { type: Number, default: 0 },
});

module.exports = mongoose.model("Roadmap", RoadmapSchema);
