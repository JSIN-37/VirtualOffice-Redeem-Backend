// USER ROUTES
const cfg = process.env; // Get server configurations

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { verifyToken } = require("../middleware/auth");

// TODO: Might be a global thing in the future
const inputsAreMissing = (inputs, res) => {
  for (var key in inputs) {
    if (inputs[key] == null) {
      res.status(400).json({
        error:
          "Request body/query/parameters is missing required data. Please refer documentation.",
      });
      return true;
    }
  }
  return false;
};

router.post("/login", async (req, res) => {
  // Request Inputs
  const inputs = {
    email: req.body.email,
    password: req.body.password,
    rememberMe: req.body.rememberMe,
  };
  if (inputsAreMissing(inputs, res)) return;
  ///////////////
  const expireTime = inputs.rememberMe == true ? "2d" : "24h";
  const hashedPassword = require("crypto")
    .createHash("sha512")
    .update(inputs.password)
    .digest("hex");
  // Get logged in user from database
  const User = require("../models/User");
  const loginUser = await User.findOne({
    raw: true,
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    where: { email: inputs.email, password: hashedPassword },
  });
  if (loginUser) {
    // Parse permissions into JSON object
    loginUser.permissions = JSON.parse(loginUser.permissions);
    // Get DivisionName, RoleName
    const Division = require("../models/Division");
    const userDivision = await Division.findOne({
      raw: true,
      attributes: ["name"],
      where: { id: loginUser.DivisionId },
    });
    loginUser["DivisionName"] = userDivision.name;
    const Role = require("../models/Role");
    const userRole = await Role.findOne({
      raw: true,
      attributes: ["name"],
      where: { id: loginUser.RoleId },
    });
    loginUser["RoleName"] = userRole.name;
    const token = jwt.sign(
      {
        userId: loginUser.id,
        roleId: loginUser.RoleId,
        divisionId: loginUser.DivisionId,
      },
      cfg.JWT_KEY,
      {
        expiresIn: expireTime,
      }
    );
    return res.json({ token, user: loginUser });
  } else res.status(401).json({ error: "User login failed." });
});

module.exports = router;
