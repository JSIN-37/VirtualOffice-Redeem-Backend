// COMMON ROUTES
const cfg = process.env; // Get server configurations

const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");

router.get("/admin-email", verifyToken, async (req, res) => {
  // Response Body Content
  const resBody = {
    adminEmail: "",
  };
  ///////////////
  const Settings = require("../models/Settings");
  const setting = await Settings.findOne({
    raw: true,
    attributes: ["voValue"],
    where: { voOption: "adminEmail" },
  });
  resBody["adminEmail"] = setting.voValue;
  res.json(resBody);
});

module.exports = router;
