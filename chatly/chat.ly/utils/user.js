const users = [];

module.exports.joinRoom = function (id, username, roomname) {
  const user = { id, username, roomname };
  users.push(user);

  return user;
};

module.exports.getCurrentUser = function (id) {
  return users.find((user) => user.id === id);
};

// user leaves chat
module.exports.userLeave = function (id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// get room users
module.exports.getRoomUsers = function (roomname) {
  return users.filter((user) => user.roomname === roomname);
};
