// DATABASE
const cfg = process.env; // Get server configurations

const { Sequelize } = require("sequelize");

const customLogging = (msg) => {
  console.log("(+) [SEQUELIZE] " + msg);
};
let dbOptions = {
  host: cfg.DB_HOST,
  dialect: "mysql",
  logging: customLogging,
};
if (!cfg.DEBUGGING_MODE) dbOptions["logging"] = false;
const db = new Sequelize(
  cfg.DB_DATABASE,
  cfg.DB_USER,
  cfg.DB_PASSWORD,
  dbOptions
);

db.authenticate()
  .then(() => console.log("(✔) Connected with database."))
  .catch((error) => {
    console.log("(✖) Error connecting to database. Maybe MySQL isn't running?");
    if (cfg.DEBUGGING_MODE) console.log(error);
    process.exit();
  });

module.exports = db;
