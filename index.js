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
let analytics = {
  visits: 0,
  clicks: {} // { "linkId:title": count }
};

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

// POST track visit - catat pengunjung baru
app.post("/api/track/visit", (req, res) => {
  analytics.visits += 1;
  res.json({ visits: analytics.visits });
});

// POST track click - catat klik link
app.post("/api/track/click", (req, res) => {
  const { linkId, title } = req.body;
  if (!linkId) return res.status(400).json({ message: "linkId wajib" });
  const key = `${linkId}:${title || linkId}`;
  analytics.clicks[key] = (analytics.clicks[key] || 0) + 1;
  res.json({ ok: true });
});

// GET analytics - ambil semua statistik
app.get("/api/analytics", (req, res) => {
  res.json(analytics);
});

// POST analytics/reset - reset semua data analitik
app.post("/api/analytics/reset", (req, res) => {
  analytics = { visits: 0, clicks: {} };
  res.json({ message: "Analitik berhasil direset ✓" });
});

// port railway wajib pakai process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
