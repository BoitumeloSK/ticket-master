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
  const { role } = JWT.verify(token, process.env.SECRET);

  if (auth && role == "admin") {
    next();
  } else {
    return res.status(400).json({ success: false, error: "Access Denied" });
  }
};

const user = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(400).json({ success: false, error: "Access Denied" });
  }
  const { role } = JWT.verify(token, process.env.SECRET);

  if (auth && ["admin", "user"].includes(role)) {
    next();
  } else {
    return res.status(400).json({ success: false, error: "Access Denied" });
  }
};

const organiser = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(400).json({ success: false, error: "Access Denied" });
  }
  const { role } = JWT.verify(token, process.env.SECRET);

  if (auth && ["admin", "organiser"].includes(role)) {
    next();
  } else {
    return res.status(400).json({ success: false, error: "Access Denied" });
  }
};

module.exports = {
  auth,
  admin,
  user,
  organiser,
};
