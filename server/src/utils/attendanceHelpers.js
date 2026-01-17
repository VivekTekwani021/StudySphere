exports.sameDate = (d1, d2) =>
  new Date(d1).toDateString() === new Date(d2).toDateString();

exports.isWeekend = (date, educationLevel) => {
  const day = new Date(date).getDay(); // 0 = Sunday, 6 = Saturday

  if (educationLevel === "school") {
    return day === 0; // Sunday
  }

  if (educationLevel === "college") {
    return day === 0 || day === 6; // Sat + Sun
  }

  return false;
};
