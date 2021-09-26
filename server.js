// Logging
require("./core/logging.js");
console.log("(+) Starting VirtualOffice API...");
// Loading configuration
require("./core/configuration.js");
// Database
const db = require("./core/database2.js");
// Email
const sendEmail = require("./core/email.js");
// Express
const app = require("./core/express.js");

// Welcome message
app.get(`/api`, (req, res) => {
  res.json({ success: `You've reached VirtualOffice API.` });
});

require("./models");

// Routes
const backdoorRouter = require("./routes/backdoor");
app.use(`/api/backdoor`, backdoorRouter);

// Catch all other routes
app.use((req, res, next) => {
  res.status(404);
  if (req.accepts("json")) {
    res.json({ error: "VirtualOffice API did not understand that request." });
    return;
  }
});
