exports.schoolOnly = (req, res, next) => {
  if (req.user.educationLevel !== "school") {
    return res.status(403).json({ message: "School access only" });
  }
  next();
};
  

exports.collegeOnly = (req, res, next) => {
  if (req.user.educationLevel !== "college") {
    return res.status(403).json({ message: "College access only" });
  }
  next();
};


exports.placementOnly = (req, res, next) => {
  if (!req.user.isPlacementEnabled) {
    return res.status(403).json({ message: "Placement module disabled" });
  }
  next();
};
