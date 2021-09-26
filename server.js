// Logging
require("./core/logging");
console.log("(+) Starting VirtualOffice API...");
// Loading configuration
require("./core/configuration");
const cfg = process.env; // Get server configurations
// Database
const db = require("./core/database");
// Email
const sendEmail = require("./core/email");
// Express
const app = require("./core/express");
// Initial database check
require("./core/initialDBCheck");
// Welcome message
app.get(`/api`, (req, res) => {
  res.json({ success: `You've reached VirtualOffice API.` });
});
// Swagger documentation
if (cfg.SERVE_DOCUMENTATION == "true") {
  const swaggerUI = require("swagger-ui-express");
  const docs = require("./docs");
  app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(docs));
  console.log(
    `*** API Documentation: https://${cfg.HOST_NAME}:${cfg.HTTPS_PORT}/api/docs`
  );
}
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
