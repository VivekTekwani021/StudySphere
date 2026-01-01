exports.onboardingRequired = (req, res, next) => {
  if (!req.user.isOnboardingComplete) {
    return res.status(403).json({
      message: "Complete onboarding first"
    });
  }
  next();
};
