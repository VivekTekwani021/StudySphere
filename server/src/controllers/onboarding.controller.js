const User = require("../models/User.model");

// COMPLETE ONBOARDING
exports.completeOnboarding = async (req, res) => {
  try {
    const { educationLevel, course, stream } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.educationLevel = educationLevel;
    user.course = course || "other";
    user.stream = stream;

    // auto-enable placement
    user.isPlacementEnabled =
      educationLevel === "college" && course === "btech";

    user.isOnboardingComplete = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Onboarding completed",
      user: {
        id: user._id,
        educationLevel: user.educationLevel,
        course: user.course,
        stream: user.stream,
        isPlacementEnabled: user.isPlacementEnabled
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
