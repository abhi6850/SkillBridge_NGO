const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['volunteer', 'ngo'],
  },
  skills: {
    type: [String],
  },
  location: {
    type: String,
  },
  bio: {
    type: String,
  },
  organization_name: {
    type: String,
  },
  organization_description: {
    type: String,
  },
  website_url: {
    type: String,
  },
    // 🔑 OTP fields
  otp: { type: String },
  otpExpires: { type: Date },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
});

// A virtual for the User's unique identifier.
// The default _id is a BSON object, this provides a cleaner 'id' string.
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('User', UserSchema);