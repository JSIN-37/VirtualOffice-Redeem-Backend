// Logging
require("./core/logging");
console.log("(+) Starting VirtualOffice API...");
// Loading configuration
require("./core/configuration");
const cfg = process.env; // Get server configurations
// Database
require("./core/database");
// Email
require("./core/email");
// Express
const app = require("./core/express");
// Multer
require("./core/multer");
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
const publicRouter = require("./routes/public");
const adminRouter = require("./routes/admin");
const backdoorRouter = require("./routes/backdoor");
app.use(`/api/public`, publicRouter);
app.use(`/api/admin`, adminRouter);
app.use(`/api/backdoor`, backdoorRouter);

// Catch all other routes
app.use((req, res, next) => {
  res.status(404);
  if (req.accepts("json")) {
    res.json({ error: "VirtualOffice API did not understand that request." });
    return;
  }
});

// Throw internal errors
app.use((err, req, res, next) => {
  if (cfg.DEBUGGING_MODE) {
    res.status(500).json({
      error:
        "Your request broke something in the backend! Check info more details.",
      info: err.stack,
    });
    console.log(err.stack);
  } else
    res
      .status(500)
      .json({ error: "Your request broke something in the backend!" });
});
