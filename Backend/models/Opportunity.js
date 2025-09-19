const mongoose = require("mongoose");

const OpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  ngo_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  required_skills: { type: [String], required: true },
  duration: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ["open", "closed"], default: "open" },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Opportunity", OpportunitySchema);