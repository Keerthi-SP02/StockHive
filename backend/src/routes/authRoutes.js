const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { requireAuth } = require("../middleware/auth");
const { nextId, readDb, sanitizeUser, writeDb } = require("../services/db");

const router = express.Router();

function signToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET || "dev-secret", {
    subject: userId,
    expiresIn: "7d"
  });
}

router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const db = readDb();
  const exists = db.users.some((item) => item.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const user = {
    id: nextId("user"),
    name,
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 10),
    balance: 1000000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.users.push(user);
  writeDb(db);

  const token = signToken(user.id);
  return res.status(201).json({ token, user: sanitizeUser(user) });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const db = readDb();
  const user = db.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(user.id);
  return res.json({ token, user: sanitizeUser(user) });
});

router.get("/profile", requireAuth, (req, res) => {
  const db = readDb();
  const user = db.users.find((item) => item.id === req.user.id);
  return res.json({ user: sanitizeUser(user) });
});

router.patch("/profile", requireAuth, (req, res) => {
  const { name, email } = req.body;
  const db = readDb();
  const user = db.users.find((item) => item.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (email && db.users.some((item) => item.email.toLowerCase() === email.toLowerCase() && item.id !== user.id)) {
    return res.status(409).json({ message: "Email already in use" });
  }

  if (name) user.name = name;
  if (email) user.email = email.toLowerCase();
  user.updatedAt = new Date().toISOString();
  writeDb(db);
  return res.json({ user: sanitizeUser(user) });
});

router.post("/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All password fields are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters" });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const db = readDb();
  const user = db.users.find((item) => item.id === req.user.id);
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.updatedAt = new Date().toISOString();
  writeDb(db);
  return res.json({ message: "Password updated" });
});

module.exports = router;
