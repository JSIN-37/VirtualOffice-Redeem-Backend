// BACKDOOR ROUTES
const cfg = process.env; // Get server configurations

const express = require("express");
const router = express.Router();
const db = require("../core/database");

router.get("/certificate", (req, res) => {
  res.download("cert/TinyCA/TinyCA.pem", "vo_cert.pem");
});

router.get("/reset", async (req, res) => {
  if (cfg.SERVER_MODE == "PROD") {
    res.json({
      error:
        "VirtualOffice API isn't running on development mode for you to do that operation.",
    });
    return;
  }
  require("../models");
  console.log("(!) Resetting database...");
  db.sync({ force: true })
    .then(async () => {
      let loadDefaults = require("../db/loadDefaults");
      await loadDefaults();
      res.json({ success: "Database reset complete." });
      console.log("(✔) Database reset complete.");
    })
    .catch((error) => {
      res.json({ error: "Database reset failed." });
      console.log("(✖) Error resetting database.");
      if (cfg.DEBUGGING_MODE) console.log(error);
    });
});

module.exports = router;
