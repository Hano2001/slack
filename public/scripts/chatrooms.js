const roomContainer = document.getElementById("chatroom_container");
const roomBtn = document.getElementById("roomBtn");
const roomForm = document.getElementById("room_create_div");
roomBtn.addEventListener("click", (e) => {
  if (roomBtn.innerHTML === "Create new room") {
    roomBtn.innerHTML = "Cancel room creation";
  } else {
    roomBtn.innerHTML = "Create new room";
  }
  roomForm.classList.toggle("room_create_div");
});

roomContainer.scrollTop = roomContainer.scrollHeight;
