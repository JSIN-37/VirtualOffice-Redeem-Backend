// ADMIN ACCOUNT CONTROLLER
const cfg = process.env; // Get server configurations

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

exports.adminLogin = async (req, res) => {
  // Request Inputs
  const inputs = {
    password: req.body.password,
    rememberMe: req.body.rememberMe,
  };
  if (inputsAreMissing(inputs, res)) return;
  ///////////////
  const expireTime = inputs.rememberMe == true ? "4h" : "2h";
  const hashedPassword = require("crypto")
    .createHash("sha512")
    .update(inputs.password)
    .digest("hex");
  // Get stored password in database
  const Settings = require("../models/Settings");
  const storedPassword = await Settings.findOne({
    raw: true,
    attributes: ["voValue"],
    where: { voOption: "adminPassword" },
  });
  // Check if password is correct
  if (storedPassword.voValue == hashedPassword) {
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ isAdmin: true }, cfg.JWT_KEY, {
      expiresIn: expireTime,
    });
    console.log(`(+) System administrator just logged in from IP: ${req.ip}`);
    return res.json({ token });
  }
  console.log(`(+) System administrator login failure from IP: ${req.ip}`);
  res.status(401).json({ error: "Admin login failed." });
};

exports.adminValidateToken = (req, res) => {
  console.log(
    `(+) System administrator checked validity of a token from IP: ${req.ip}`
  );
  res.json({ success: "Token is still valid." });
};

exports.adminUpdateOrganizationInfo = async (req, res) => {
  // Request Inputs
  const inputs = {
    organizationName: req.body.organizationName,
    organizationCountry: req.body.organizationCountry,
    organizationContactNumber: req.body.organizationContactNumber,
    organizationAddress: req.body.organizationAddress,
  };
  if (inputsAreMissing(inputs, res)) return;
  ///////////////
  const Settings = require("../models/Settings");
  for (var key in inputs) {
    await Settings.update(
      { voValue: inputs[key] },
      {
        where: {
          voOption: key,
        },
      }
    );
  }
  res.json({ success: "Organization information updated." });
};

exports.adminUpdateOrganizationLogo = (req, res) => {
  const { uploadLogo } = require("../core/uploads");
  uploadLogo(req, res, (err) => {
    // Request Inputs
    const inputs = {
      file: req.file,
    };
    if (inputsAreMissing(inputs, res)) return;
    ////////////////////
    if (err) {
      if (cfg.DEBUGGING_MODE) console.log(err);
      return res.status(400).json({ error: "Updating logo failed." });
    }
    return res.json({ success: "Organization logo updated." });
  });
};

exports.adminUpdateCredentials = async (req, res) => {
  // Request Inputs
  const inputs = {
    adminEmail: req.body.adminEmail,
    adminPassword: req.body.adminPassword,
    adminSetup: "done",
  };
  if (inputsAreMissing(inputs, res)) return;
  ///////////////
  inputs.adminPassword = require("crypto")
    .createHash("sha512")
    .update(inputs.adminPassword)
    .digest("hex");
  const Settings = require("../models/Settings");
  for (var key in inputs) {
    await Settings.update(
      { voValue: inputs[key] },
      {
        where: {
          voOption: key,
        },
      }
    );
  }
  // Set adminSetup state globally on server
  const { adminSetupCheck } = require("../core/database");
  adminSetupCheck();
  res.json({ success: "Admin credentials updated." });
};
