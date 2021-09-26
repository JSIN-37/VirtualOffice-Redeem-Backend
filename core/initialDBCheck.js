// INITIAL DATABASE CHECK
const cfg = process.env; // Get server configurations

const db = require("./database");
const Settings = require("../models/Settings");

const initialDBCheck = async () => {
  try {
    // Check if there are tables in the database
    const [results] = await db.query("SHOW TABLES");
    if (results.length) {
      console.log("(✔) Initial database check passed.");
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
    console.log("(✖) Initial database check failed.");
    if (cfg.DEBUGGING_MODE) console.log(error);
    process.exit();
  }
};

const adminSetupCheck = async () => {
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

initialDBCheck();
