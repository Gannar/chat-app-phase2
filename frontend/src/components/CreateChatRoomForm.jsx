import React, { useState } from "react";
import axios from "axios";

const CreateChatRoomForm = () => {
const [roomName, setRoomName] = useState("");
const [message, setMessage] = useState("");
const [error, setError] = useState("");

const handleSubmit = async (e) => {
e.preventDefault();

setMessage("");
setError("");

try {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    "http://localhost:3000/api/chatrooms",
    { name: roomName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  setMessage("✅ Chat room created successfully!");
  setRoomName("");
  console.log(res.data);
} catch (err) {
  setError(err.response?.data?.message || "❌ Failed to create room");
}


};

return ( <div style={styles.container}> <h2>Create Chat Room</h2>

  <form onSubmit={handleSubmit} style={styles.form}>
    <input
      type="text"
      placeholder="Enter room name"
      value={roomName}
      onChange={(e) => setRoomName(e.target.value)}
      style={styles.input}
      required
    />

    <button type="submit" style={styles.button}>
      Create
    </button>
  </form>

  {message && <p style={styles.success}>{message}</p>}
  {error && <p style={styles.error}>{error}</p>}
</div>


);
};

const styles = {
container: {
maxWidth: "400px",
margin: "20px auto",
padding: "20px",
border: "1px solid #ccc",
borderRadius: "8px",
textAlign: "center",
},
form: {
display: "flex",
gap: "10px",
},
input: {
flex: 1,
padding: "8px",
},
button: {
padding: "8px 12px",
cursor: "pointer",
},
success: {
color: "green",
marginTop: "10px",
},
error: {
color: "red",
marginTop: "10px",
},
};

export default CreateChatRoomForm;
