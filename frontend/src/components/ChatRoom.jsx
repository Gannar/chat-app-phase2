import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";
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

return ( <div style={styles.container}> <h2>Chat Room</h2>


  <div style={styles.messages}>
    {messages.map((msg) => {
      const isOwnMessage =
        msg.sender?._id === userId || msg.sender === userId;

      return (
        <div
          key={msg._id}
          style={{
            ...styles.messageWrapper,
            justifyContent: isOwnMessage ? "flex-end" : "flex-start",
          }}
        >
          <div
            style={{
              ...styles.message,
              backgroundColor: isOwnMessage ? "#DCF8C6" : "#EEE",
            }}
          >
            {!isOwnMessage && (
              <div style={styles.sender}>
                {msg.sender?.name}
              </div>
            )}

            <div>{msg.content}</div>

            <div style={styles.time}>
              {formatTime(msg.createdAt)}
            </div>
          </div>
        </div>
      );
    })}
  </div>

  <MessageForm roomId={roomId} />
</div>


);
};

const styles = {
container: {
maxWidth: "600px",
margin: "20px auto",
border: "1px solid #ccc",
borderRadius: "8px",
display: "flex",
flexDirection: "column",
height: "80vh",
},
messages: {
flex: 1,
padding: "10px",
overflowY: "auto",
display: "flex",
flexDirection: "column",
gap: "8px",
},
messageWrapper: {
display: "flex",
},
message: {
padding: "10px",
borderRadius: "10px",
maxWidth: "70%",
},
sender: {
fontSize: "12px",
fontWeight: "bold",
marginBottom: "4px",
},
time: {
fontSize: "10px",
textAlign: "right",
marginTop: "5px",
color: "#666",
},
};

export default ChatRoom;
