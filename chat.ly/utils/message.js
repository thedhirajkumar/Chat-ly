const moment = require("moment");

module.exports = function (username, text) {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
  };
};
