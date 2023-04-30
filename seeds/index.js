const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/ticket-masterDB");

async function seedData() {
  const password = await bcrypt.hash("test123", 10);
  User.insertMany([
    {
      name: "John Doe",
      email: "user@email.com",
      password: password,
      role: "user",
    },
    {
      name: "Jane Ross",
      email: "admin@email.com",
      password: password,
      role: "admin",
    },
  ]).then((data) => {
    console.log(data);
  });
}

seedData();