// ADMIN ROUTES
const cfg = process.env; // Get server configurations

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.post("/login", async (req, res) => {
  // Request Body Content
  const password = req.body.password;
  const rememberMe = req.body.rememberMe;
  ///////////////
  if (!password) {
    return res.status(400).json({
      error:
        "Request body is missing required data. Please refer documentation.",
    });
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
    where: { voOption: "adminPassword" },
  });
  // Check if password is correct
  if (storedPassword.voValue == hashedPassword) {
    const token = jwt.sign({ isAdmin: true }, cfg.JWT_KEY, {
      expiresIn: expireTime,
    });
    console.log(`(+) System administrator just logged in from IP: ${req.ip}`);
    return res.json({ token });
  }
  console.log(`(+) System administrator login failure from IP: ${req.ip}`);
  res.status(401).json({ error: "Admin login failed." });
});

router.get("/validate-token", verifyToken, verifyAdmin, (req, res) => {
  console.log(
    `(+) System administrator checked validity of a token from IP: ${req.ip}`
  );
  res.json({ success: "Token is still valid." });
});

router.put("/organization-info", verifyToken, verifyAdmin, async (req, res) => {
  // Request Body Content
  const reqBody = {
    organizationName: req.body.organizationName,
    organizationCountry: req.body.organizationCountry,
    organizationContactNumber: req.body.organizationContactNumber,
    organizationAddress: req.body.organizationAddress,
  };
  ///////////////
  for (var key in reqBody) {
    if (!reqBody[key]) {
      return res.status(400).json({
        error:
          "Request body is missing required data. Please refer documentation.",
      });
    }
  }
  const Settings = require("../models/Settings");
  for (var key in reqBody) {
    await Settings.update(
      { voValue: reqBody[key] },
      {
        where: {
          voOption: key,
        },
      }
    );
  }
  res.json({ success: "Organization information updated." });
});

router.put("/organization-logo", verifyToken, verifyAdmin, (req, res) => {
  const { uploadLogo } = require("../core/multer");
  uploadLogo(req, res, (err) => {
    // Request Body Content
    const file = req.file;
    ////////////////////
    if (!file) {
      return res.status(400).json({
        error:
          "Request body is missing required data. Please refer documentation.",
      });
    }
    if (err) {
      if (cfg.DEBUGGING_MODE) console.log(err);
      return res.status(400).json({ error: "Updating logo failed." });
    }
    return res.json({ success: "Organization logo updated." });
  });
});

router.put("/credentials", verifyToken, verifyAdmin, async (req, res) => {
  // Request Body Content
  const reqBody = {
    adminEmail: req.body.adminEmail,
    adminPassword: req.body.adminPassword,
    adminSetup: "done",
  };
  ///////////////
  for (var key in reqBody) {
    if (!reqBody[key]) {
      return res.status(400).json({
        error:
          "Request body is missing required data. Please refer documentation.",
      });
    }
  }
  reqBody.adminPassword = require("crypto")
    .createHash("sha512")
    .update(reqBody.adminPassword)
    .digest("hex");
  const Settings = require("../models/Settings");
  for (var key in reqBody) {
    await Settings.update(
      { voValue: reqBody[key] },
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
});

router.get("/divisions", verifyToken, verifyAdmin, async (req, res) => {
  const Division = require("../models/Division");
  const allDivisions = await Division.findAll({
    raw: true,
    attributes: ["id", "name", "description"],
  });
  res.json(allDivisions);
});

router.post("/division", verifyToken, verifyAdmin, async (req, res) => {
  // Request Body Content
  const reqBody = {
    divisionName: req.body.divisionName,
    divisionDescription: req.body.divisionDescription,
  };
  ///////////////
  for (var key in reqBody) {
    if (!reqBody[key]) {
      return res.status(400).json({
        error:
          "Request body is missing required data. Please refer documentation.",
      });
    }
  }
  const Division = require("../models/Division");
  await Division.create({
    name: reqBody.divisionName,
    description: reqBody.divisionDescription,
  });
  res.json({ success: "New division created." });
});

router.put("/division/:id", verifyToken, verifyAdmin, async (req, res) => {
  // Request Body Content
  const reqBody = {
    idParam: req.params.id,
    divisionName: req.body.divisionName,
    divisionDescription: req.body.divisionDescription,
  };
  ///////////////
  for (var key in reqBody) {
    if (!reqBody[key]) {
      return res.status(400).json({
        error:
          "Request body/parameters is missing required data. Please refer documentation.",
      });
    }
  }
  const Division = require("../models/Division");
  await Division.update(
    { name: reqBody.divisionName, description: reqBody.divisionDescription },
    {
      where: {
        id: reqBody.idParam,
      },
    }
  );
  res.json({ success: "Division updated." });
});

router.delete("/division/:id", verifyToken, verifyAdmin, async (req, res) => {
  // Request Parameter
  const idParam = req.params.id;
  ///////////////
  if (!idParam) {
    return res.status(400).json({
      error:
        "Request body/parameters is missing required data. Please refer documentation.",
    });
  }
  // Check if the division has no employees
  const User = require("../models/User");
  const employeeCount = await User.count({ where: { divisionId: idParam } });
  if (employeeCount == 0) {
    const Division = require("../models/Division");
    await Division.destroy({
      where: {
        id: idParam,
      },
    });
    return res.json({ success: "Division deleted." });
  } else {
    return res.status(400).json({
      error: "Division cannot be deleted since there are employees under it.",
    });
  }
});

module.exports = router;
