const nameEdit = document.getElementById("edit_name");
const userNameEdit = document.getElementById("edit_username");
const emailEdit = document.getElementById("edit_email");
const nameForm = document.getElementById("name_edit");
const userNameForm = document.getElementById("username_edit");
const emailForm = document.getElementById("email_edit");
const profileBtn = document.getElementById("profileBtn");
const profileForm = document.getElementById("pic_edit");
// const success = document.getElementsByClassName("success_message");

// function fadeMessage(x){
//     setTimeout
// }
nameEdit.addEventListener("click", (e) => {
  nameForm.classList.toggle("edit");
});
userNameEdit.addEventListener("click", (e) => {
  userNameForm.classList.toggle("edit");
});
emailEdit.addEventListener("click", (e) => {
  emailForm.classList.toggle("edit");
});

profileBtn.addEventListener("click", (e) => {
  profileForm.classList.toggle("edit");
});
