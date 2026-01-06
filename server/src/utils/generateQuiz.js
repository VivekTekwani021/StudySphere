// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// exports.generateQuizQuestions = async (topic) => {
//   const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//   const prompt = `
// Generate exactly 12 MCQ questions on topic "${topic}".
// Rules:
// - 4 Easy, 4 Medium, 4 Hard
// - Each question must have 4 options
// - Mention correct answer explicitly
// - Return STRICT JSON ONLY in this format:

// [
//   {
//     "question": "",
//     "options": ["", "", "", ""],
//     "correctAnswer": "",
//     "difficulty": "Easy"
//   }
// ]
// `;

//   const result = await model.generateContent(prompt);

//   return JSON.parse(result.response.text());
// };
const axios = require("axios");

exports.generateQuizQuestions = async (topic) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are an exam paper setter who generates clean MCQ questions in JSON."
          },
          {
            role: "user",
            content: `
Generate EXACTLY 12 MCQ questions on topic "${topic}".

Rules:
- 4 Easy, 4 Medium, 4 Hard
- Each question must have 4 options
- Mention correctAnswer explicitly
- Do NOT add explanations
- Return STRICT JSON ONLY in this format:

[
  {
    "question": "",
    "options": ["", "", "", ""],
    "correctAnswer": "",
    "difficulty": "Easy"
  }
]
`
          }
        ],
        temperature: 0.3,
        max_tokens: 1200
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return JSON.parse(response.data.choices[0].message.content);

  } catch (error) {
    console.error("QUIZ GEN ERROR 👉", error.response?.data);
    throw new Error("Failed to generate quiz");
  }
};

