const socket = io();

const info = document.getElementById("info");
const socketId = info.dataset.socket_id;
const userId = info.dataset.user_id;
socket.emit("userSet", socketId);
socket.emit("userOnline", userId);
