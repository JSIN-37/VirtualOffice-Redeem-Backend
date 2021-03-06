// CONFIGURATION

const fs = require("fs");

if (fs.existsSync("./config/production.cfg")) {
  require("dotenv").config({ path: "./config/production.cfg" });
  console.log("(✔) Loaded production configuration.");
  process.env.SERVER_MODE = "PROD";
} else {
  if (fs.existsSync("./config/development.cfg")) {
    require("dotenv").config({ path: "./config/development.cfg" });
    console.log("(✔) Loaded development configuration.");
    process.env.SERVER_MODE = "DEV";
  } else {
    console.log(
      "(✖) Couldn't find a valid configuration.\nCheck config 'directory' for either 'production.cfg' or 'development.cfg' files?"
    );
    process.exit();
  }
}

process.env.NEEDS_INITIAL_SETUP = true; // By default let's say yes, check with database later

// // Setup paths for ease-of-use ? Possible use-case ?
// const dirs = fs
//   .readdirSync(".", { withFileTypes: true })
//   .filter((dirEntry) => dirEntry.isDirectory())
//   .map((dirEntry) => dirEntry.name);

// for (const dir in dirs) {
//   process.env["path_" + dirs[dir]] = `${process.cwd()}/${dirs[dir]}`;
// }
