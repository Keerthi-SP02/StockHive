const jwt = require("jsonwebtoken");
const { readDb, sanitizeUser } = require("../services/db");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const db = readDb();
    const user = db.users.find((item) => item.id === payload.sub);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = sanitizeUser(user);
    next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { requireAuth };
