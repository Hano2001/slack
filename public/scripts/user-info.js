const nameBtn = document.getElementById("nameBtn");
const usernameBtn = document.getElementById("usernameBtn");
const emailBtn = document.getElementById("emailBtn");
const nameForm = document.getElementById("name_edit");
const userNameForm = document.getElementById("username_edit");
const emailForm = document.getElementById("email_edit");
const profileBtn = document.getElementById("profileBtn");
const profileForm = document.getElementById("pic_edit");
const passwordForm = document.getElementById("password_edit");
const passwordBtn = document.getElementById("passwordBtn");

nameBtn.addEventListener("click", (e) => {
  nameForm.classList.toggle("edit");
  if (nameBtn.innerHTML != "Update name") {
    nameBtn.innerHTML = "Update name";
  } else {
    nameBtn.innerHTML = "Cancel";
  }
});
usernameBtn.addEventListener("click", (e) => {
  userNameForm.classList.toggle("edit");
  if (usernameBtn.innerHTML != "Update username") {
    usernameBtn.innerHTML = "Update username";
  } else {
    usernameBtn.innerHTML = "Cancel";
  }
});
emailBtn.addEventListener("click", (e) => {
  emailForm.classList.toggle("edit");
  if (emailBtn.innerHTML != "Update E-mail") {
    emailBtn.innerHTML = "Update E-mail";
  } else {
    emailBtn.innerHTML = "Cancel";
  }
});

profileBtn.addEventListener("click", (e) => {
  profileForm.classList.toggle("edit");
  if (profileBtn.innerHTML != "Change Profile-picture") {
    profileBtn.innerHTML = "Change Profile-picture";
  } else {
    profileBtn.innerHTML = "Cancel";
  }
});

passwordBtn.addEventListener("click", (e) => {
  passwordForm.classList.toggle("edit");
  if (passwordBtn.innerHTML != "Update Password") {
    passwordBtn.innerHTML = "Update Password";
  } else {
    passwordBtn.innerHTML = "Cancel";
  }
});
