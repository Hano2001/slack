const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelectorAll(".chat-messages");
const socket = io();
const info = document.getElementById("info");
const username = info.dataset.username;
const userId = info.dataset.user_id;
const roomId = info.dataset.room_id;

//Join room
socket.emit("joinRoom", { userId, username, roomId });

socket.emit("setUser", { username, userId, roomId });

socket.on("message", (data) => {
  outputMessage(data);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message sent
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = e.target.elements.msg.value;
  const message = { text, username };
  //Emit msg to server
  socket.emit("chatMessage", message);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
  //outputMessage(message);
});

function outputMessage(message) {
  //chatMessages = ;
  const div1 = document.createElement("div");
  const div2 = document.createElement("div");
  const adminDiv = document.createElement("div");

  div1.classList.add("user-message-div");
  div2.classList.add("message-div");
  adminDiv.classList.add("admin-message");

  const innerHTML = `<p class="message-sender">${message.username}</p>
  <p>${message.text}</p>
  <br />`;
  adminDiv.innerHTML = div2.innerHTML = div1.innerHTML = innerHTML;
  if (message.username === username) {
    document.getElementById("chat-messages").appendChild(div1);
  } else if (message.username === "SlackcopyCat ADMIN") {
    document.getElementById("chat-messages").appendChild(adminDiv);
  } else {
    document.getElementById("chat-messages").appendChild(div2);
  }
}
