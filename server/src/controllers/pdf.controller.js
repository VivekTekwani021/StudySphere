//const { generateLearningContent } = require("../services/ai.service");
const { generateExplanation } = require("../services/ai.service");

const { generatePDF } = require("../utils/pdfGenerator");
const User = require("../models/User.model");

exports.downloadNotesPDF = async (req, res) => {
  try {
    const { topic, prompt } = req.body;

    const user = await User.findById(req.user._id);

    const level =
      user.educationLevel === "school" ? "school" : "college";

    // Generate AI notes (or reuse cached later)
    const explanation = await generateExplanation(
      topic,
      prompt,
      level
    );

    // Generate PDF
    generatePDF(
      `Notes - ${topic}`,
      explanation,
      res
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
