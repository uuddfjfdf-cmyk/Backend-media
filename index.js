const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// health check (wajib buat deploy debug)
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is running 🚀"
  });
});

// contoh API
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Hello dari backend Node.js"
  });
});

// port railway wajib pakai process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});