// BACKDOOR ROUTES
const cfg = process.env; // Get server configurations

const express = require("express");
const router = express.Router();
const { db, adminSetupCheck } = require("../core/database");

router.get("/certificate", (req, res) => {
  if (cfg.SERVER_MODE == "PROD") {
    return res.json({
      error:
        "VirtualOffice API isn't running on development mode for you to do that operation.",
    });
  }
  res.download("cert/TinyCA/TinyCA.pem", "root_certificate.pem");
});

router.get("/reset", async (req, res) => {
  if (cfg.SERVER_MODE == "PROD") {
    return res.json({
      error:
        "VirtualOffice API isn't running on development mode for you to do that operation.",
    });
  }
  require("../models");
  console.log("(!) Resetting database...");
  db.sync({ force: true })
    .then(async () => {
      let loadDefaults = require("../db/loadDefaults");
      await loadDefaults();
      res.json({ success: "Database reset complete." });
      console.log("(✔) Database reset complete.");
      // Run adminSetup check again
      adminSetupCheck();
    })
    .catch((error) => {
      res.status(500).json({ error: "Database reset failed." });
      console.log("(✖) Error resetting database.");
      if (cfg.DEBUGGING_MODE) console.log(error);
    });
});

module.exports = router;
