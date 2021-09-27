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

const testDB = async () => {
  try {
    await db.authenticate();
    console.log("(✔) Connected with database.");
    testDBIntegrity();
  } catch (error) {
    console.log("(✖) Error connecting to database. Maybe MySQL isn't running?");
    if (cfg.DEBUGGING_MODE) console.log(error);
    process.exit();
  }
};

const testDBIntegrity = async () => {
  try {
    // Check if there are tables in the database
    const [results] = await db.query("SHOW TABLES");
    if (results.length) {
      console.log("(✔) Database integrity test passed.");
      adminSetupCheck();
      return;
    }
    console.log("(!) Database is not setup yet.");
    require("../models");
    console.log("(+) Attempting to setup database...");
    db.sync({ force: true })
      .then(async () => {
        let loadDefaults = require("../db/loadDefaults");
        await loadDefaults();
        console.log("(✔) Database initial setup done.");
        adminSetupCheck();
      })
      .catch((error) => {
        console.log("(✖) Database initial setup failed.");
        if (cfg.DEBUGGING_MODE) console.log(error);
        process.exit();
      });
  } catch (error) {
    console.log("(✖) Database integrity test failed.");
    if (cfg.DEBUGGING_MODE) console.log(error);
    process.exit();
  }
};

const adminSetupCheck = async () => {
  const Settings = require("../models/Settings");
  const setupStatus = await Settings.findOne({
    raw: true,
    attributes: ["voValue"],
    where: { voOption: "admin_setup" },
  });
  try {
    if (setupStatus.voValue == "done") {
      cfg.NEEDS_INITIAL_SETUP = false;
    } else if (setupStatus.voValue == "") {
      cfg.NEEDS_INITIAL_SETUP = true;
      console.log("(!) Initial administrator setup is required.");
    }
  } catch (error) {
    console.log("(✖) Database appears to be corrupted.");
    if (cfg.DEBUGGING_MODE) console.log(error);
    process.exit();
  }
};

testDB();

module.exports = db;
