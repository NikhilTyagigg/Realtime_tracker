const express = require("express");
const app = express();
const socketIo = require("socket.io");
const http = require("http");
const path = require("path");

const server = http.createServer(app);
const io = socketIo(server);

// Serve static files correctly
app.use(express.static(path.join(__dirname, "public")));

// Set view engine to EJS
app.set("view engine", "ejs");

// Handle WebSocket connections
io.on("connection", (socket) => {
  socket.on("sendLocation", function (data) {
    io.emit("receiveLocation", { id: socket.id, ...data });
  });
  socket.on("disconnect", function () {
    io.emit("user-disconnected", socket.id);
  });
});

// Route for the homepage
app.get("/", (req, res) => {
  res.render("index"); // Ensure views/index.ejs exists
});

// Start server
server.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
