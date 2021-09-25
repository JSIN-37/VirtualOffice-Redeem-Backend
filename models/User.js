const Sequelize = require("sequelize");
const db = require("../core/database");

const User = db.define("vo_user2", {
  first_name: {
    type: Sequelize.STRING,
  },
  last_name: { type: Sequelize.STRING },
});

module.exports = User;
