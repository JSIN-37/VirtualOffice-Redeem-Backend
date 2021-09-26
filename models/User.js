const Sequelize = require("sequelize");
const db = require("../core/database2");

const User = db.define("User", {
  uuid: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  first_name: {
    type: Sequelize.STRING,
  },
  last_name: { type: Sequelize.STRING },
});

module.exports = User;
