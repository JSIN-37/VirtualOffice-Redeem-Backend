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

router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  const reqQuery = {
    divisionId: req.query.divisionId,
    roleId: req.query.roleId,
    nameLike: req.query.nameLike,
    emailLike: req.query.emailLike,
  };
  let filter = {};
  const { Op } = require("sequelize");
  if (reqQuery.divisionId) filter["divisionId"] = reqQuery.divisionId;
  if (reqQuery.roleId) filter["roleId"] = reqQuery.roleId;
  if (reqQuery.nameLike)
    filter["fullName"] = { [Op.like]: `%${reqQuery.nameLike.toLowerCase()}%` };
  if (reqQuery.emailLike)
    filter["email"] = { [Op.like]: `%${reqQuery.emailLike.toLowerCase()}%` };
  console.log(filter);
  const User = require("../models/User");
  const allUsers = await User.findAll({
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    where: filter,
  });
  res.json(allUsers);
});

router.post("/user", verifyToken, verifyAdmin, async (req, res) => {
  // Request Body Content
  const reqBody = {
    userFirstName: req.body.userFirstName,
    userEmail: req.body.userEmail,
    userDivisionId: req.body.userDivisionId,
    userRoleId: req.body.userRoleId,
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
  // Generate a random temporary password
  const tempPassword = Math.random().toString(36).slice(-8);
  const User = require("../models/User");
  try {
    await User.create({
      firstName: reqBody.userFirstName,
      email: reqBody.userEmail,
      password: tempPassword,
      DivisionId: reqBody.userDivisionId,
      RoleId: reqBody.userRoleId,
    });
    // Check if this is the documentation email
    if (
      reqBody.userEmail !=
      "please.use.real.email.here.before.trying.out.in.swagger@gmail.com"
    ) {
      const sendEmail = require("../core/email");
      sendEmail(
        reqBody.userEmail,
        "VirtualOffice Account Registration",
        `<center>
        <b>Please click the link below to login to your VirtualOffice account,</b><br>
        <a href=${cfg.FRONTEND_URL}>Login to VirtualOffice</a> <br><br>
        Username: ${reqBody.userEmail} <br>
        Password: ${tempPassword} <br>
        </center>`
      );
    }
    return res.json({ success: "New user created." });
  } catch (error) {
    if (cfg.DEBUGGING_MODE) console.log(error);
    return res.status(405).json({
      error: "An existing user has the same email given for new user.",
    });
  }
});

module.exports = router;
