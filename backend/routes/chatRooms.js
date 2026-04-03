const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const ChatRoom = require("../models/ChatRoom");

// Create a chat room
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Room name is required" });
    }

    const existingRoom = await ChatRoom.findOne({ name: name.trim() });
    if (existingRoom) {
      return res.status(400).json({ message: "Chat room already exists" });
    }

    const room = await ChatRoom.create({
      name: name.trim(),
      createdBy: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: "Failed to create room", error: error.message });
  }
});

// Get all chat rooms
router.get("/", authMiddleware, async (req, res) => {
  try {
    const rooms = await ChatRoom.find()
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rooms", error: error.message });
  }
});

// Get one chat room
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!room) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch room", error: error.message });
  }
});

// Join a chat room
router.post("/:id/join", authMiddleware, async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    const alreadyMember = room.members.some(
      (memberId) => memberId.toString() === req.user.id
    );

    if (alreadyMember) {
      return res.status(400).json({ message: "You already joined this room" });
    }

    room.members.push(req.user.id);
    await room.save();

    const updatedRoom = await ChatRoom.findById(room._id)
      .populate("createdBy", "name email")
      .populate("members", "name email");
      const io = req.app.get("io");

// after saving room
io.to(room._id.toString()).emit("roomUpdated", {
  roomId: room._id,
  members: updatedRoom.members,
});

    res.json({ message: "Joined room successfully", room: updatedRoom });
  } catch (error) {
    res.status(500).json({ message: "Failed to join room", error: error.message });
  }
});



// Leave a chat room
router.post("/:id/leave", authMiddleware, async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    const isMember = room.members.some(
      (memberId) => memberId.toString() === req.user.id
    );

    if (!isMember) {
      return res.status(400).json({ message: "You are not a member of this room" });
    }

    room.members = room.members.filter(
      (memberId) => memberId.toString() !== req.user.id
    );

    await room.save();

    const updatedRoom = await ChatRoom.findById(room._id)
      .populate("createdBy", "name email")
      .populate("members", "name email");
const io = req.app.get("io");

// after saving room
io.to(room._id.toString()).emit("roomUpdated", {
  roomId: room._id,
  members: updatedRoom.members,
});
    res.json({ message: "Left room successfully", room: updatedRoom });
  } catch (error) {
    res.status(500).json({ message: "Failed to leave room", error: error.message });
  }
});


// Delete a chat room (only creator can delete)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    if (room.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the room creator can delete it" });
    }

    await room.deleteOne();

    res.json({ message: "Chat room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete room", error: error.message });
  }
});

module.exports = router;