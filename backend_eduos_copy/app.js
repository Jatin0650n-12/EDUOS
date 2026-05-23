const express = require('express')
require('dotenv').config();
const http = require('http');
const cors = require('cors');
const db = require('./database/db')



const authRoutes = require('./routes/auth-routes');
const fileRoutes = require('./routes/file-routes');
const extractRoutes = require('./routes/extract-route');
const skillRoutes = require('./routes/skill-routes');

const Question = require("./models/Question");
const RoleSkills = require("./models/RoleSkills");
const QuizAttempt = require("./models/QuizAttempt");


const Groq = require("groq-sdk");
require('dotenv').config();
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = new Groq({
  apiKey: GROQ_API_KEY
});
const app = express()
app.get("/", (req, res) => {
  res.send("EDUOS Backend is running 🚀");
});
db();



app.use(cors());
app.use(express.json());
app.use('/api/auth' ,  authRoutes);
app.use('/api/files' ,  fileRoutes);
app.use('/api/extract' ,  extractRoutes);
app.use('/api/skills' ,  skillRoutes);


app.get("/quiz/:role", async (req, res) => {

 try {

 const role = req.params.role;
console.log("Role received:", role);
 const roleData = await RoleSkills.findOne({ role : role });

 if(!roleData){
   return res.status(404).json({message:"Role not found"});
 }

 const skills = roleData.skills;

 const questions = await Question.aggregate([
   { $match: { skill: { $in: skills } } },
   { $sample: { size: 10 } }
 ]);

 res.json(questions);

 } catch(err){

 console.error(err);
 res.status(500).json({error:"Server error"});

 }

});
app.post("/quiz/submit", async (req, res) => {

  try {

    const { userId, role, responses } = req.body;

    let correct = 0;
    let totalTime = 0;

    const detailed = [];

    for (let r of responses) {

      const q = await Question.findById(r.questionId);

      if (!q) continue;

      const isCorrect = q.answer === r.selected;

      if (isCorrect) correct++;

      totalTime += r.responseTime;

      detailed.push({
        skill: q.skill,
        correct: isCorrect,
        responseTime: r.responseTime
      });

    }

    const skillStats = {};

for (let r of detailed) {

 if (!skillStats[r.skill]) {
   skillStats[r.skill] = { correct: 0, total: 0 };
 }

 skillStats[r.skill].total++;

 if (r.correct) {
   skillStats[r.skill].correct++;
 }

}

const strongSkills = [];
const weakSkills = [];
const mediumSkills = [];

for (let skill in skillStats) {

 const accuracy = skillStats[skill].correct / skillStats[skill].total;

 if (accuracy >= 0.75) {
   strongSkills.push(skill);
 }
 else if (accuracy <= 0.40) {
   weakSkills.push(skill);
 }
 else {
   mediumSkills.push(skill);
 }

}

    
    const accuracy = correct / responses.length;
    const avgTime = totalTime / responses.length;

    const attempt = new QuizAttempt({
 userId,
 role,
 responses: detailed,
 accuracy,
 avgResponseTime: avgTime,
 strongSkills,
 weakSkills,
 mediumSkills
});

await attempt.save();

    res.json({
 accuracy,
 avgResponseTime: avgTime,
 strongSkills,
 weakSkills,
 mediumSkills
});

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Server error" });

  }

});

// app.post("/roadmap/generate", async (req, res) => {

//   const { role, accuracy, strongSkills, mediumSkills, weakSkills } = req.body;

//   const prompt = `
// Generate a personalized learning roadmap for ${role}.

// Accuracy: ${accuracy}
// Strong Skills: ${(strongSkills || []).join(",")}
// Medium Skills: ${(mediumSkills || []).join(",")}
// Weak Skills: ${(weakSkills || []).join(",")}

// Return JSON with week, focus_skill, learning_topics, practice_task.
// `;

//   try {

//     const response = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant",
//       messages: [
//         { role: "user", content: prompt }
//       ]
//     });

//     const roadmap = response.choices[0].message.content;

//     res.json({ roadmap });

//   } catch (err) {

//     console.error(err.response?.data || err.message || err);

//     res.status(500).json({
//       error: "AI generation failed",
//       details: err.message
//     });

//   }

// });


app.post("/roadmap/generate", async (req, res) => {

  const { role, accuracy, strongSkills, mediumSkills, weakSkills } = req.body;

  const prompt = `
Generate a personalized 8 week learning roadmap for ${role}.

Accuracy: ${accuracy}
Strong Skills: ${(strongSkills || []).join(",")}
Medium Skills: ${(mediumSkills || []).join(",")}
Weak Skills: ${(weakSkills || []).join(",")}

IMPORTANT RULES:
Return ONLY valid JSON.
Do not include explanations.
Do not include markdown.
Structure must be:

[
  {
    "week": 1,
    "focus_skill": "skill name",
    "learning_topics": ["topic1","topic2"],
    "practice_task": ["task1","task2"]
  }
]
`;

  try {

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    });

    let roadmapText = response.choices[0].message.content;

    // Remove markdown if present
    roadmapText = roadmapText.replace(/```json|```/g, "");

    // Extract JSON object or array
    const match = roadmapText.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);

    if (!match) {
      return res.status(500).json({
        error: "Invalid AI response format"
      });
    }

    // Parse JSON safely
    const roadmapJSON = JSON.parse(match[0]);

    // Ensure response is array
    const roadmapArray = Array.isArray(roadmapJSON)
      ? roadmapJSON
      : Object.values(roadmapJSON);

    res.json({
      roadmap: roadmapArray
    });

  } catch (err) {

    console.error(err.response?.data || err.message || err);

    res.status(500).json({
      error: "AI generation failed",
      details: err.message
    });

  }

});

app.post("/copilot/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  try {
    const prompt = `
You are an AI learning copilot for students.
Answer the following question clearly and simply:

Question: ${question}

IMPORTANT RULES:
- Return ONLY the explanation in plain text.
- Do NOT include markdown unless necessary for clarity.
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    });

    let answerText = response.choices[0].message.content;
    answerText = answerText.replace(/```/g, "").trim();

    res.json({ answer: answerText });

  } catch (err) {
    console.error(err.response?.data || err.message || err);
    res.status(500).json({ error: "AI Copilot failed", details: err.message });
  }
});


// server.js
// app.post("/copilot/ask", async (req, res) => {
//   const { role, weakTopics = [], quizzes = [], question } = req.body;

//   if (!question || !role) {
//     return res.status(400).json({ error: "Role and question are required" });
//   }

//   try {
//     // 1. Build adaptive prompt dynamically
//     const prompt = `
// You are an AI learning copilot for a student learning ${role}.
// Student's recent quiz scores: ${quizzes.map(q => `${q.topic}: ${q.score}%`).join("; ")}
// Weak topics: ${weakTopics.join(", ")}
// Explain the following question clearly in simple terms, and provide guidance to help the student improve their weak topics.

// Question: ${question}

// IMPORTANT RULES:
// - Return ONLY the explanation and guidance in plain text.
// - Do NOT include markdown unless necessary for clarity.
// `;

//     // 2. Call Grok API
//     const response = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant",
//       messages: [{ role: "user", content: prompt }]
//     });

//     let answerText = response.choices[0].message.content;
//     answerText = answerText.replace(/```/g, "").trim();

//     res.json({ answer: answerText });

//   } catch (err) {
//     console.error(err.response?.data || err.message || err);
//     res.status(500).json({ error: "AI Copilot failed", details: err.message });
//   }
// });

const port = process.env.PORT || 5010;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});