const Attendance = require("../models/Attendance.model");
const Habit = require("../models/Habit.model");

/**
 * ===============================
 * 📅 MONTH SUMMARY (Calendar View)
 * ===============================
 * Returns: [{ date, status }]
 * status = good | okay | bad
 */
exports.getMonthSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month } = req.query; // "2026-01"

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // 1️⃣ Fetch attendance for the month
    const attendanceRecords = await Attendance.find({
      user: userId,
      createdAt: { $gte: startDate, $lt: endDate }
    });

    // 2️⃣ Fetch habits (if any)
    const habits = await Habit.find({ user: userId });

    // Map dates -> data
    const dayMap = {};

    attendanceRecords.forEach(a => {
      const day = a.createdAt.toISOString().slice(0, 10);
      if (!dayMap[day]) dayMap[day] = {};
      dayMap[day].attendance = true;
    });

    // 3️⃣ Build calendar response
    const result = [];

    for (
      let d = new Date(startDate);
      d < endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dayStr = d.toISOString().slice(0, 10);

      const hasAttendance = dayMap[dayStr]?.attendance || false;

      let status = "bad";
      if (hasAttendance) status = "good";

      result.push({
        date: dayStr,
        status
      });
    }

    res.json(result);
  } catch (error) {
    console.error("Calendar Month Error:", error);
    res.status(500).json({ message: "Failed to load calendar" });
  }
};

/**
 * ===============================
 * 📅 DAY SUMMARY (On Date Click)
 * ===============================
 * Explains WHY the day is good/bad
 */
exports.getDaySummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.query; // "2026-01-10"

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const attendance = await Attendance.find({
      user: userId,
      createdAt: { $gte: start, $lt: end }
    });

    const overall = attendance.length > 0 ? "good" : "bad";

    res.json({
      date,
      overall,
      attendance: attendance.length > 0,
      insight:
        overall === "good"
          ? "Attendance marked. Good consistency."
          : "No attendance recorded for this day."
    });
  } catch (error) {
    console.error("Calendar Day Error:", error);
    res.status(500).json({ message: "Failed to load day summary" });
  }
};
