const JWT = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(400).json({ success: false, error: "No token provided" });
  }

  try {
    const user = JWT.verify(token, process.env.SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({ success: false, error: "Invalid token" });
  }
};

const admin = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(400).json({ success: false, error: "Access Denied" });
  }

  try {
    const { role } = JWT.verify(token, process.env.SECRET);
    if (role != "admin") {
      return res.status(400).json({ success: false, error: "Access Denied" });
    }
    next();
  } catch (error) {
    return res.status(400).json({ success: false, error: "Invalid token" });
  }
};

const user = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(400).json({ success: false, error: "Access Denied" });
  }

  try {
    const { role } = JWT.verify(token, process.env.SECRET);
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ success: false, error: "Access Denied" });
    }
    next();
  } catch (error) {
    return res.status(400).json({ success: false, error: "Invalid token" });
  }
};

const organiser = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(400).json({ success: false, error: "Access Denied" });
  }

  try {
    const { role } = JWT.verify(token, process.env.SECRET);
    if (!["admin", "organiser"].includes(role)) {
      return res.status(400).json({ success: false, error: "Access Denied" });
    }
    next();
  } catch (error) {
    return res.status(400).json({ success: false, error: "Invalid token" });
  }
};

module.exports = {
  auth,
  admin,
  user,
  organiser,
};
