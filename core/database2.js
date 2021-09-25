// DATABASE
const cfg = process.env; // Get server configurations

const { Sequelize } = require("sequelize");

const db = new Sequelize(cfg.DB_DATABASE, cfg.DB_USER, cfg.DB_PASSWORD, {
  host: cfg.DB_HOST,
  dialect: "mysql",
  // logging: false,
});

db.authenticate()
  .then(() => console.log("(✔) Connected with database."))
  .catch((error) => {
    console.log(
      "(✖) Error connecting to database. Maybe MySQL isn't running?"
    );
    // console.error(error);
  });

module.exports = db;
