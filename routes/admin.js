// ADMIN ROUTES
const cfg = process.env; // Get server configurations

const express = require("express");
const router = express.Router();
// const db = require("../core/database");
const jwt = require("jsonwebtoken");

const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.post("/login", async (req, res) => {
  // Body Content
  const password = req.body.password;
  const rememberMe = req.body.rememberMe;
  ///////////////
  if (!password) {
    res.status(400).json({
      error:
        "Request body is missing required data. Please refer documentation.",
    });
    return;
  }
  const expireTime = rememberMe == true ? "4h" : "2h";
  const hashedPassword = require("crypto")
    .createHash("sha512")
    .update(password)
    .digest("hex");
  // Get stored password in database
  const Settings = require("../models/Settings");
  const storedPassword = await Settings.findOne({
    raw: true,
    attributes: ["voValue"],
    where: { voOption: "admin_password" },
  });
  // Check if password is correct
  if (storedPassword.voValue == hashedPassword) {
    const token = jwt.sign({ isAdmin: true }, cfg.JWT_KEY, {
      expiresIn: expireTime,
    });
    res.json({ token });
    console.log(`(+) System administrator just logged in from IP: ${req.ip}`);
    return;
  }
  res.status(401).json({ error: "Admin login failed." });
  console.log(`(+) System administrator login failure from IP: ${req.ip}`);
});

router.get("/check-token", verifyToken, verifyAdmin, (req, res) => {
  console.log(
    `(+) System administrator checked validity of a token from IP: ${req.ip}`
  );
  res.json({ success: "Token is still valid." });
});

module.exports = router;
