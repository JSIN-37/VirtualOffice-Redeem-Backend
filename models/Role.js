const Sequelize = require("sequelize");
const { db } = require("../core/database");

const Role = db.define("Role", {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  permissions: Sequelize.JSON,
});

module.exports = Role;
