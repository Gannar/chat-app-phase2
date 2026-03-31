
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));

// 404
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

