const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
  skill: String,
  difficulty: String
});

module.exports = mongoose.model("Question", questionSchema, "questions");