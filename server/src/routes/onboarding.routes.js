const express = require("express");
const router = express.Router();
const { completeOnboarding } = require("../controllers/onboarding.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/complete", protect, completeOnboarding);

module.exports = router;
