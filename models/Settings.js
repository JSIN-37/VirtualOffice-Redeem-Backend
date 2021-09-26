const Sequelize = require("sequelize");
const db = require("../core/database");

const Settings = db.define("Settings", {
  voOption: { type: Sequelize.STRING, allowNull: false, unique: true },
  voValue: { type: Sequelize.STRING, allowNull: false },
});

module.exports = Settings;
