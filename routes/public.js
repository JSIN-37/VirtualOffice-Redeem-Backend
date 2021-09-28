// PUBLIC ROUTES
const cfg = process.env; // Get server configurations

const express = require("express");
const router = express.Router();

router.get("/server-status", (req, res) => {
  res.json({
    serverReady: true,
    serverInitialized: cfg.NEEDS_INITIAL_SETUP == "true" ? false : true,
  });
});

router.get("/organization-info", async (req, res) => {
  // Response Body Content
  const resBody = {
    organizationName: "",
    organizationCountry: "",
    organizationContactNumber: "",
    organizationAddress: "",
  };
  ///////////////
  const Settings = require("../models/Settings");
  for (var key in resBody) {
    const setting = await Settings.findOne({
      raw: true,
      attributes: ["voValue"],
      where: { voOption: key },
    });
    resBody[key] = setting.voValue;
  }
  res.json(resBody);
});

module.exports = router;
