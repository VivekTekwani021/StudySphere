// const mongoose = require("mongoose");

// const subjectAttendanceSchema = new mongoose.Schema({
//   subjectName: String,
//   totalClasses: { type: Number, default: 0 },
//   attendedClasses: { type: Number, default: 0 },
//   presentDates:[{type:Date}],
//   absentDates:[{type:Date}],
//   streak: { type: Number, default: 0 }
// });

// const attendanceSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
// //For school
//   totalClasses: { type: Number, default: 0 },
//   attendedClasses: { type: Number, default: 0 },
//   presentDates:[{type:Date}],
//   absentDates:[{type:Date}],
//     schoolStreak: {
//       type: Number,
//       default: 0
//     },
// //fOR COLLEGE
//     subjects: [subjectAttendanceSchema]
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Attendance", attendanceSchema);


const mongoose = require("mongoose");

const subjectAttendanceSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true
  },
  presentDates: [{ type: Date }],
  absentDates: [{ type: Date }],
  streak: {
    type: Number,
    default: 0
  }
});

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // SCHOOL
    presentDates: [{ type: Date }],
    absentDates: [{ type: Date }],
    schoolStreak: {
      type: Number,
      default: 0
    },

    // COLLEGE
    subjects: [subjectAttendanceSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);

