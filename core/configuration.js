// CONFIGURATION

const fs = require("fs");

if (fs.existsSync("./config/production.cfg")) {
  require("dotenv").config({ path: "./config/production.cfg" });
  console.log("Loaded production configuration.");
} else {
  if (fs.existsSync("./config/development.cfg")) {
    require("dotenv").config({ path: "./config/development.cfg" });
    console.log("Loaded development configuration.");
  } else {
    console.log(
      "Couldn't find a valid configuration.\nCheck config 'directory' for either 'production.cfg' or 'development.cfg' files?"
    );
    process.exit();
  }
}

process.env.NEEDS_INITIAL_SETUP = true; // By default let's say yes, check with database later
