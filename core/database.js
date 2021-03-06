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
    if (cfg.DEBUGGING_MODE) console.log(error);
    console.log("(✖) Error connecting to database. Maybe MySQL isn't running?");
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
        if (cfg.DEBUGGING_MODE) console.log(error);
        console.log("(✖) Database initial setup failed.");
        process.exit();
      });
  } catch (error) {
    if (cfg.DEBUGGING_MODE) console.log(error);
    console.log("(✖) Database integrity test failed.");
    process.exit();
  }
};

const adminSetupCheck = async () => {
  const Settings = require("../models/Settings");
  const setupStatus = await Settings.findOne({
    raw: true,
    attributes: ["voValue"],
    where: { voOption: "adminSetup" },
  });
  try {
    if (setupStatus.voValue == "done") {
      cfg.NEEDS_INITIAL_SETUP = false;
    } else if (setupStatus.voValue == "") {
      cfg.NEEDS_INITIAL_SETUP = true;
      console.log("(!) Initial administrator setup is required.");
    }
  } catch (error) {
    if (cfg.DEBUGGING_MODE) console.log(error);
    console.log("(✖) Database appears to be corrupted.");
    process.exit();
  }
};

testDB();

module.exports = { db, adminSetupCheck };
