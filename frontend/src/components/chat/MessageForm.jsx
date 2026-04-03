import React, { useState } from "react";
import socket from "../../socket";

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
<form className="message-form" onSubmit={handleSubmit}>
  <input
    className="message-input"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
  />
  <button className="send-btn">Send</button>
</form>
  );
};

export default MessageForm;