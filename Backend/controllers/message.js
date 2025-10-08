const User = require("../models/User");
const Message = require("../models/Message");
const mongoose = require("mongoose");
let cloudinary;
try {
  cloudinary = require("../lib/cloudinary");
} catch (e) {
  cloudinary = null;
}
const socketModule = require("../lib/socket");

// Get all users except the logged-in user
const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get messages between logged-in user and another user
const getMessages = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id: userToChatId } = req.params;
    const myId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userToChatId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Soft delete a message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user.id;

    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this message" });
    }

    // Soft delete
    message.text = "This message was deleted";
    message.image = null;
    await message.save();

    const receiverSocketId = socketModule.getReceiverSocketId(message.receiverId);
    if (receiverSocketId && socketModule.io) {
      socketModule.io.to(receiverSocketId).emit("messageDeleted", message);
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    if (!req.user || !req.user.id) return res.status(401).json({ error: "Unauthorized" });

    const senderId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(receiverId)) return res.status(400).json({ error: "Invalid receiver id" });
    if (receiverId === senderId) return res.status(400).json({ error: "Cannot send message to yourself" });

    const receiver = await User.findById(receiverId).select("_id");
    if (!receiver) return res.status(404).json({ error: "Receiver not found" });
    if (!text && !image) return res.status(400).json({ error: "Message text or image is required" });

    let imageUrl;
    if (image && cloudinary) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (e) {
        return res.status(400).json({ error: "Invalid image data" });
      }
    } else if (image) {
      imageUrl = image;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = socketModule.getReceiverSocketId(receiverId);
    if (receiverSocketId && socketModule.io) {
      socketModule.io.to(receiverSocketId).emit("newMessage", newMessage);
      socketModule.io.to(receiverSocketId).emit("notification", {
        type: "message",
        fromUserId: senderId,
        messageId: newMessage._id,
        text: text || (imageUrl ? "Sent an image" : "New message"),
        createdAt: newMessage.createdAt,
      });
    }

    const senderSocketId = socketModule.getReceiverSocketId(senderId);
    if (senderSocketId && socketModule.io) {
      socketModule.io.to(senderSocketId).emit("newMessageAck", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUsersForSidebar,
  getMessages,
  deleteMessage,
  sendMessage,
};
