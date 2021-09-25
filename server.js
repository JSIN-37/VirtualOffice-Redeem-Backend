// Logging
require("./core/logging.js");
console.log("Starting VirtualOffice backend...");
// Loading configuration
require("./core/configuration.js");
// Database
const db = require("./core/database.js");
// Email
const sendEmail = require("./core/email.js");