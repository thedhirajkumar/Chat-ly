const chatMessages = document.getElementById("chat-messages");
const roomName = document.getElementById("room-name");
const members = document.getElementById("members");
const chatForm = document.getElementById("chat-form");

// get username and roomnamefrom url
const { username, roomname } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

socket.emit("joinRoom", { username, roomname });

socket.on("message", (msg) => {
  outputMessage(msg);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("roomUsers", ({ roomname, users }) => {
  outputRoomName(roomname);

  outputRoomUsers(users);
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get message text
  const msg = e.target.elements.chatMessage.value;

  // empty the input
  e.target.elements.chatMessage.value = "";
  e.target.elements.chatMessage.focus();

  // emit the message to the serve
  socket.emit("chatMessage", msg);
});

function outputMessage(msg) {
  var messageBox = document.createElement("div");

  messageBox.classList.add("message-holder");
  messageBox.innerHTML = ` <div class="about">
    <div class="name">${msg.username}</div>
    <div class="time">${msg.time}</div>
    </div>
    <div class="message">${msg.text}</div>`;

  chatMessages.appendChild(messageBox);
}

function outputRoomName(roomname) {
  roomName.innerHTML = roomname;
}

function outputRoomUsers(users) {
  members.innerHTML = `
    ${users
      .map((user) => {
        return `<div class="member">${user.username}</div>`;
      })
      .join("")}
  `;
}
