// const express = require("express");
// const router = express.Router();

// const {
//   markSchoolAttendance,
//   markSubjectAttendance,
//   getAttendance
// } = require("../controllers/attendance.controller");

// const { protect } = require("../middleware/auth.middleware");
// const {
//   schoolOnly,
//   collegeOnly
// } = require("../middleware/role.middleware");
// const { onboardingRequired } = require("../middleware/onboarding.middleware");

// // SCHOOL
// router.post(
//   "/school",
//   protect,
//   markSchoolAttendance
// );

// // COLLEGE
// router.post(
//   "/college",
//   protect,
//   markSubjectAttendance
// );

// // SHARED GET
// router.get("/", protect, getAttendance);

// module.exports = router;
const express = require("express");
const router = express.Router();

const {
  markSchoolAttendance,
  markSubjectAttendance,
  getAttendance
} = require("../controllers/attendance.controller");

const {
  setupSubjects,
  addSubject,
  deleteSubject
} = require("../controllers/subject.controller");

const { protect } = require("../middleware/auth.middleware");

// SUBJECT SETUP & MANAGEMENT
router.post("/subjects/setup", protect, setupSubjects);
router.post("/subjects/add", protect, addSubject);
router.delete("/subjects/:subjectName", protect, deleteSubject);

// ATTENDANCE
router.post("/school", protect, markSchoolAttendance);
router.post("/college", protect, markSubjectAttendance);

// GET ATTENDANCE
router.get("/", protect, getAttendance);

module.exports = router;

