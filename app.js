const express = require("express");
const socket = require("socket.io");

const app = express();

app.use(express.static("public")); // frontend files

let port = 5000;
let server = app.listen(port, () => {
  console.log("Listening to port " + port);
});

let io = socket(server);

io.on("connection", (socket) => {
  console.log("Connection made");

  // Recieved Data from frontend
  socket.on("beginPath", (data) => {
    // Trasnfer data to all sockets (all connected devices to the server)
    io.sockets.emit("beginPath", data);
  });

  socket.on("drawStroke", (data) => {
    // Trasnfer data to all sockets (all connected devices to the server)
    io.sockets.emit("drawStroke", data);
  });

  socket.on("redoUndo", (data) => {
    // Trasnfer data to all sockets (all connected devices to the server)
    io.sockets.emit("redoUndo", data);
  });
});
