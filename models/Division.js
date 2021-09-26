const Sequelize = require("sequelize");
const db = require("../core/database");

const Division = db.define("Division", {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
});

module.exports = Division;
