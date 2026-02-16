const bcrypt = require("bcryptjs");

const admin = {
  username: "admin",
  password: bcrypt.hashSync("bully123", 10)
};

module.exports = admin;
