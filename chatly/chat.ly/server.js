const http = require("http");
const path = require("path");

const express = require("express");
const socketio = require("socket.io");

const User = require("./utils/user");
const formatMessage = require("./utils/message");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

app.use(express.static(path.join(__dirname, "public")));

const botName = "Chat.ly";

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, roomname }) => {
    const user = User.joinRoom(socket.id, username, roomname);

    socket.join(user.roomname);

    // welcome the current user
    socket.emit(
      "message",
      formatMessage(botName, `Welcome to ${user.roomname}`)
    );

    // broadcast when a user joins
    socket.broadcast
      .to(user.roomname)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat!`)
      );

    io.to(user.roomname).emit("roomUsers", {
      roomname: user.roomname,
      users: User.getRoomUsers(user.roomname),
    });
  });

  socket.on("chatMessage", (msg) => {
    const user = User.getCurrentUser(socket.id);

    io.to(user.roomname).emit("message", formatMessage(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = User.userLeave(socket.id);

    if (user) {
      io.to(user.roomname).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
    }

    // send users and room info
    io.to(user.roomname).emit("roomUsers", {
      roomname: user.roomname,
      users: User.getRoomUsers(user.roomname),
    });
  });
});

module.exports = server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
