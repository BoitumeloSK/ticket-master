const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
require("dotenv").config();
const { validationResult } = require("express-validator");

function getAllUsers(req, res) {
  User.find()
    .then((data) => {
      return res.status(200).json({ success: true, data: data });
    })
    .catch((error) => {
      return res.status(400).json({ success: false, error: error });
    });
}

function getUser(req, res) {
  const { id } = req.params;
  User.findById(id)
    .then((data) => {
      if (data.length == 0) {
        return res.status(400).json({
          success: false,
          error: `User with id ${id} does not exist.`,
        });
      }
      return res.status(200).json({ success: true, data: data });
    })
    .catch((error) => {
      return res.status(400).json({ success: false, error: error });
    });
}

function signup(req, res) {
  const { name, email, password } = req.body;
  const errors = validationResult(req);
  User.find({ email: email }).then(async (data) => {
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array() });
    }
    if (data.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "Email not available" });
    } else {
      const hash = await bcrypt.hash(password, 10);

      User.create({ name, email, password: hash })
        .then((data) => {
          return res.status(200).json({ success: true, data: data });
        })
        .catch((error) => {
          return res.status(400).json({ success: false, error: error });
        });
    }
  });
}

function login(req, res) {
  const { email, password } = req.body;
  User.find({ email })
    .then(async (data) => {
      if (data.length == 0) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid login credentials" });
      }
      const match = await bcrypt.compare(password, data[0].password);
      if (!match) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid login credentials" });
      }
      const token = JWT.sign(
        { userId: data[0]._id, role: data[0].role },
        process.env.SECRET,
        {
          expiresIn: "7d",
        }
      );
      return res.status(200).json({ success: true, data: data, token });
    })
    .catch((error) => {
      return res.status(400).json({ success: false, error: error });
    });
}

function updateUserPassword(req, res) {
  const { id } = req.params;
  const { password } = req.body;
  User.findById(id).then(async (data) => {
    if (data.length == 0) {
      return res.status(400).json({
        success: false,
        error: `User with id ${id} does not exist`,
      });
    }
    const token = req.header("x-auth-token");

    const { userId } = JWT.verify(token, process.env.SECRET);

    if (id != userId) {
      return res.status(400).json({
        success: false,
        error: "Not authorised to change user password",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    User.findByIdAndUpdate(id, { $set: { password: hash } })
      .then((data) => {
        return res.status(200).json({ success: true, data: data });
      })
      .catch((error) => {
        return res.status(400).json({ success: false, error: error });
      });
  });
}

function updateUserRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;

  User.findById(id).then((data) => {
    if (data.length == 0) {
      return res
        .status(400)
        .json({ success: false, error: `User with id ${id} does not exist.` });
    }
    User.findByIdAndUpdate(id, { $set: { role } })
      .then((data) => {
        return res.status(200).json({ success: true, data: data });
      })
      .catch((error) => {
        return res.status(400).json({ success: false, error: error });
      });
  });
}

function deleteUser(req, res) {
  const { id } = req.params;
  let removeUser = false;
  User.findById(id).then((data) => {
    if (data.length == 0) {
      return res.status(400).json({
        success: false,
        error: `User with id ${id} does not exist.`,
      });
    }
    const { userId, role } = JWT.verify(
      req.header("x-auth-token"),
      process.env.SECRET
    );

    if (role == "admin") {
      removeUser = true;
    } else {
      if (id == userId) {
        removeUser = true;
      }
    }

    if (!removeUser) {
      return res
        .status(400)
        .json({ success: false, error: `Not authorised to delete user.` });
    }

    User.findByIdAndDelete(id)
      .then((data) => {
        return res.status(200).json({ success: true, data: data });
      })
      .catch((error) => {
        return res.status(400).json({ success: false, error: error });
      });
  });
}

module.exports = {
  getAllUsers,
  getUser,
  signup,
  login,
  updateUserPassword,
  updateUserRole,
  deleteUser,
};
