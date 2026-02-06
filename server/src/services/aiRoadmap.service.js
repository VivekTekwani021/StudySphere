// const openrouter = require("../utils/openrouter");

// exports.generateRoadmapAI = async (topic, duration, level) => {
//   const prompt = `
// Create a ${duration}-day study roadmap.

// Topic: ${topic}
// Level: ${level}

// Return ONLY JSON format:
// [
//  { day:1, topic:"", tasks:["",""] }
// ]
// `;

//   const ai = await openrouter(prompt);

//   try {
//     return JSON.parse(ai);
//   } catch {
//     throw new Error("AI JSON parse failed");
//   }
// };
const openrouter = require("../utils/openrouter");

exports.generateRoadmapAI = async (topic, duration, level) => {
  const prompt = `
You are a strict JSON generator.

Create a ${duration}-day study roadmap.

Topic: ${topic}
Level: ${level}

Return ONLY valid JSON array.
Do NOT write explanation.
Do NOT write text.
Only JSON.

Format:
[
 { "day": 1, "topic": "string", "tasks": ["task1","task2"] }
]
`;

  const aiText = await openrouter(prompt);

  // 🧠 CLEAN AI RESPONSE
  const jsonMatch = aiText.match(/\[.*\]/s);

  if (!jsonMatch) {
    console.log("AI RAW RESPONSE:", aiText);
    throw new Error("AI returned invalid JSON");
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.log("PARSE ERROR RAW:", aiText);
    throw new Error("AI JSON parse failed");
  }
};
