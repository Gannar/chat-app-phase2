const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const ChatRoom = require("../models/ChatRoom");

/**
 * @route   GET /api/messages/:roomId
 * @desc    Get messages for a chat room
 */
router.get("/:roomId", authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ chatRoom: roomId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

/**
 * @route   POST /api/messages/:roomId
 * @desc    Send a message
 */
router.post("/:roomId", authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // Check if room exists
    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    // Check if user is a member
    const isMember = room.members.some(
      (memberId) => memberId.toString() === req.user.id
    );

    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this room" });
    }

    // Create message
    const message = await Message.create({
      chatRoom: roomId,
      sender: req.user.id,
      content: content.trim(),
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email");

    // 🔥 Emit real-time message
    const io = req.app.get("io");
    io.to(roomId).emit("newMessage", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;