const express = require("express");
const auth = require("../middleware/auth");
const {
  getMessages,
  getUsersForSidebar,
  sendMessage,
  deleteMessage,
} = require("../controllers/message");

const router = express.Router();

router.get("/users", auth, getUsersForSidebar);
// username search (query ?q=username)
router.get("/search", auth, async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json([]);
  try {
    const User = require("../models/User");
    const results = await User.find({
      username: { $regex: q, $options: "i" },
      _id: { $ne: req.user.id },
    }).select("-password");
    res.json(results);
  } catch (e) {
    console.error("Username search error:", e);
    res.status(500).json({ error: "Search failed" });
  }
});
router.get("/:id", auth, getMessages);

router.post("/send/:id", auth, sendMessage);
router.delete("/:id", auth, deleteMessage);

module.exports = router; // CommonJS export
