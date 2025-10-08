const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const authMiddleware = require("../middleware/auth"); 

// @route   POST /api/auth/register
// @desc    Register a new user (Volunteer or NGO)
// @access  Public
router.post('/register', async (req, res) => {
  const {
    username,
    name,
    email,
    password,
    role,
    location,
    skills,
    organization_name,
    organization_description,
    website_url
  } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      name,
      email,
      password: hashedPassword,
      role: role.toLowerCase(),
      location,
      skills: Array.isArray(skills) ? skills : skills?.split(",") || [],
      organization_name: organization_name || "",
      organization_description: organization_description || "",
      website_url: website_url || "",
    });

    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});
// @route   PUT /api/auth/profile/:id
// @desc    Update user profile
// @access  Private (requires token)
router.put('/profile/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, location, skills, organization_name, organization_description, website_url } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Only allow the user to edit their own profile
    if (user.id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update fields based on role
    user.name = name || user.name;
    user.location = location || user.location;

    if (user.role === 'volunteer') {
      user.skills = skills || user.skills;
    } else if (user.role === 'ngo') {
      user.organization_name = organization_name || user.organization_name;
      user.organization_description = organization_description || user.organization_description;
      user.website_url = website_url || user.website_url;
    }

    await user.save();
    res.json({ msg: 'Profile updated successfully', user });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// =============================
// 🔑 Forgot Password Flow
// =============================

// @route   POST /api/auth/forgot-password
// @desc    Send OTP to email
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    await user.save();

    // Send email
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // Gmail App password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    res.json({ msg: 'OTP sent to email' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP
// @access  Public
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    res.json({ msg: 'OTP verified, proceed to reset password' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password after OTP verification
// @access  Public
// Ensure you have this at the top of your server

router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ msg: "Email and new password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ msg: "Password reset successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// profile
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const {
      username,
      name,
      role,
      email,
      location,
      skills,
      organization_name,
      organization_description,
      website_url,
    } = req.body;

    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Volunteer fields
    if (username) user.username = username;
    if (name) user.name = name;
    if (role) user.role = role;
    if (location) user.location = location;
    if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(",");

    // NGO fields
    if (organization_name) user.organization_name = organization_name;
    if (organization_description) user.organization_description = organization_description;
    if (website_url) user.website_url = website_url;

    await user.save();

    res.json({ msg: "Profile updated successfully", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router; 