const mongoose = require("mongoose");

const roleSkillsSchema = new mongoose.Schema({
  role: String,
  skills: [String]
});

module.exports = mongoose.model("RoleSkills", roleSkillsSchema, "role_skills");