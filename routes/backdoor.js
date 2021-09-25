// BACKDOOR ROUTES
const cfg = process.env; // Get server configurations

const express = require("express");
const router = express.Router();
const db = require("../core/database.js");

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
  console.log("(!) Resetting database...");
  // db.sync({ force: true }).then(() => {
  //   console.log("Drop and re-sync db.");
  // });
  res.json({ success: "Database reset complete." });
  console.log("(✔) Database reset complete.");
});

module.exports = router;
