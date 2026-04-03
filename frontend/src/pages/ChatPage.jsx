import React, { useState } from "react";
import ChatRoomList from "../components/chat/ChatRoomList";
import ChatRoom from "../components/chat/ChatRoom";
import "../styles/chat.css";

const ChatPage = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: "30%" }}>
        <ChatRoomList onSelectRoom={setSelectedRoom} />
      </div>

      {/* Chat area */}
      <div style={{ width: "70%" }}>
        {selectedRoom ? (
          <ChatRoom roomId={selectedRoom} />
        ) : (
          <p>Select a room</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;