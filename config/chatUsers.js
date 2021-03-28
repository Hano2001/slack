const users = [];

//Joining user to room
function userJoin(userId, username, roomId) {
  let user = {
    username: username,
    userId: userId,
    roomId: roomId,
  };
  users.push(user);

  return user;
}

//Getting current user

function currentUser(id) {
  return users.find((user) => user.id === id);
}

module.exports = { userJoin, currentUser };
