const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: "Opportunity", required: true },
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Application", ApplicationSchema);