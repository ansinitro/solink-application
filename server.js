const express = require("express");
const path = require("path");
const { PORT } = require("./configs/config.js");
const app = express();

app.use("/public", express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "wallet-connect.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "registration.html"));
});

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "profile.html"));
});

const port = PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
