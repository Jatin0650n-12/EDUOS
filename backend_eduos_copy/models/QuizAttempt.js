const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({

  userId: String,

  role: String,

  responses: [
    {
      skill: String,
      correct: Boolean,
      responseTime: Number
    }
  ],

  accuracy: Number,

  avgResponseTime: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);