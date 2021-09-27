const Sequelize = require("sequelize");
const { db } = require("../core/database");

const Role = db.define("Role", {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  locked: Sequelize.BOOLEAN,
});

module.exports = Role;
