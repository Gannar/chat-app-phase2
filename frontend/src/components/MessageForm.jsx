import React, { useState } from "react";
import socket from "../socket";

const MessageForm = ({ roomId }) => {
  const [message, setMessage] = useState("");

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    socket.emit("sendMessage", {
      roomId,
      userId: getUserIdFromToken(),
      content: message,
    });

    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ flex: 1 }}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageForm;