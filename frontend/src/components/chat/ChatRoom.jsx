import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../../socket";
import MessageForm from "./MessageForm";

const ChatRoom = ({ roomId }) => {
const [messages, setMessages] = useState([]);
const token = localStorage.getItem("token");

// Get logged-in user ID
const getUserIdFromToken = () => {
try {
const payload = JSON.parse(atob(token.split(".")[1]));
return payload.id;
} catch {
return null;
}
};

const userId = getUserIdFromToken();

const fetchMessages = async () => {
try {
const res = await axios.get(
`http://localhost:3000/api/messages/${roomId}`,
{
headers: { Authorization: `Bearer ${token}` },
}
);
setMessages(res.data);
} catch (err) {
console.error("Failed to load messages");
}
};

useEffect(() => {
if (!roomId) return;


fetchMessages();

socket.emit("joinRoom", roomId);

socket.on("newMessage", (newMsg) => {
  setMessages((prev) => [...prev, newMsg]);
});

return () => {
  socket.emit("leaveRoom", roomId);
  socket.off("newMessage");
};


}, [roomId]);

// Format time
const formatTime = (date) => {
return new Date(date).toLocaleTimeString([], {
hour: "2-digit",
minute: "2-digit",
});
};

return ( <div > <h2>Chat Room</h2>


<div className="messages">
  {messages.map((msg) => {
    const isOwn = msg.sender._id === userId;

    return (
      <div
        key={msg._id}
        className={`message ${isOwn ? "own" : "other"}`}
      >
        {!isOwn && <div className="sender">{msg.sender.name}</div>}
        <div>{msg.content}</div>
        <div className="time">
          {new Date(msg.createdAt).toLocaleTimeString()}
        </div>
      </div>
    );
  })}
</div>

  <MessageForm roomId={roomId} />
</div>


);
};



export default ChatRoom;
