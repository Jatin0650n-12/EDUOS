const axios = require('axios');

// POST /api/skills/recommend
// Body: { skills: ["Python", "Flask", "AWS"] }
async function recommend(req, res) {
  try {
    const skills = req.body.skills;

    // ✅ Basic validation
    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid skills provided.'
      });
    }

    // ✅ Clean input
    const cleanedSkills = skills.map(s => s.trim()).filter(s => s.length > 0);

    // ✅ ML microservice URL (your Flask model)
    // const ML_URL = 'http://127.0.0.1:5001/recommend-skills';
const ML_URL = 'https://eduos-ml.onrender.com/recommend-skills';
    console.log("🔹 Sending skills to Python ML service:", cleanedSkills);

    // ✅ Call Python Flask API
    const response = await axios.post(ML_URL, { skills: cleanedSkills });

    console.log("✅ Received response from ML service:", response.data);

    // ✅ Return response to Angular frontend
    return res.status(200).json({
      success: true,
      input_skills: cleanedSkills,
      recommended_skills: response.data.recommended_skills || [],
    });

  } catch (error) {
    console.error("❌ Error in recommend controller:", error.message);

    // Check if Python service is down or slow
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'ML service not reachable. Please ensure it is running on port 5001.'
      });
    }

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        success: false,
        message: 'ML service request timed out. Try again later.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error during skill recommendation.',
      error: error.message,
    });
  }
}

module.exports = { recommend };
