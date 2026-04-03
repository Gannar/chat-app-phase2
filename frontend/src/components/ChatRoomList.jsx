import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";

const ChatRoomList = () => {
const [rooms, setRooms] = useState([]);
const token = localStorage.getItem("token");

const fetchRooms = async () => {
const res = await axios.get("http://localhost:3000/api/chatrooms", {
headers: { Authorization: `Bearer ${token}` },
});
setRooms(res.data);
};

useEffect(() => {
fetchRooms();


// Listen for real-time updates
socket.on("roomUpdated", ({ roomId, members }) => {
  setRooms((prevRooms) =>
    prevRooms.map((room) =>
      room._id === roomId ? { ...room, members } : room
    )
  );
});

return () => {
  socket.off("roomUpdated");
};


}, []);

const joinRoom = async (roomId) => {
await axios.post(
`http://localhost:3000/api/chatrooms/${roomId}/join`,
{},
{ headers: { Authorization: `Bearer ${token}` } }
);


socket.emit("joinRoom", roomId);


};

const leaveRoom = async (roomId) => {
await axios.post(
`http://localhost:3000/api/chatrooms/${roomId}/leave`,
{},
{ headers: { Authorization: `Bearer ${token}` } }
);


socket.emit("leaveRoom", roomId);


};

return ( <div> <h2>Chat Rooms</h2>
{rooms.map((room) => ( <div key={room._id}> <h4>{room.name}</h4> <p>Members: {room.members?.length}</p>


      <button onClick={() => joinRoom(room._id)}>Join</button>
      <button onClick={() => leaveRoom(room._id)}>Leave</button>
    </div>
  ))}
</div>


);
};

export default ChatRoomList;
