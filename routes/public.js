// PUBLIC ROUTES
const cfg = process.env; // Get server configurations

const express = require("express");
const router = express.Router();

router.get("/server-status", (req, res) => {
  res.json({ ready: true, initialized: !cfg.NEEDS_INITIAL_SETUP });
});

module.exports = router;
