const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// in-memory storage
let avatarData = null;
let siteData = null;

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

// GET avatar - ambil foto profil
app.get("/api/avatar", (req, res) => {
  if (!avatarData) {
    return res.status(404).json({ message: "Avatar belum diset" });
  }
  res.json({ avatar: avatarData });
});

// POST avatar - simpan foto profil (base64)
app.post("/api/avatar", (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).json({ message: "Data avatar tidak ditemukan" });
  }
  avatarData = avatar;
  res.json({ message: "Avatar berhasil disimpan ✓" });
});

// GET data - ambil semua data (nama, bio, links)
app.get("/api/data", (req, res) => {
  if (!siteData) {
    return res.status(404).json({ message: "Data belum diset" });
  }
  res.json(siteData);
});

// POST data - simpan semua data
app.post("/api/data", (req, res) => {
  const { name, bio, social, product } = req.body;
  if (!name && !bio && !social && !product) {
    return res.status(400).json({ message: "Data tidak valid" });
  }
  siteData = { name, bio, social, product };
  res.json({ message: "Data berhasil disimpan ✓" });
});

// port railway wajib pakai process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
