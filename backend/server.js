
const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Make io accessible in routes
app.set("io", io);

// Socket connection
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
  });

   // 🔥 HANDLE SENDING MESSAGE
  socket.on("sendMessage", async ({ roomId, userId, content }) => {
    try {
      if (!content || !content.trim()) return;

      const room = await ChatRoom.findById(roomId);
      if (!room) return;

      // Optional: check membership
      const isMember = room.members.some(
        (id) => id.toString() === userId
      );
      if (!isMember) return;

      // Save message
      const message = await Message.create({
        chatRoom: roomId,
        sender: userId,
        content: content.trim(),
      });

      const populatedMessage = await Message.findById(message._id)
        .populate("sender", "name email");

      // 🔥 Broadcast to room
      io.to(roomId).emit("newMessage", populatedMessage);

    } catch (err) {
      console.error("Socket message error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});


// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/chatrooms", require("./routes/chatRooms")); 
app.use("/api/messages", require("./routes/messages"));

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

