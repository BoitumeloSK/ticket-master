const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect("mongodb://127.0.0.1:27017/ticket-masterDB");
app.use(express.json());

app.get("*", (req, res) => {
  res.send("This is not a valid route.");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
