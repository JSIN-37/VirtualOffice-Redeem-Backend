// ADMIN ROUTES
const cfg = process.env; // Get server configurations

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { verifyToken, verifyAdmin } = require("../middleware/auth");

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
});

router.put("/organization-logo", verifyToken, verifyAdmin, (req, res) => {
  const { uploadLogo } = require("../core/multer");
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
});

router.put("/credentials", verifyToken, verifyAdmin, async (req, res) => {
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
  // Request Inputs
  const inputs = {
    divisionName: req.body.divisionName,
    divisionDescription: req.body.divisionDescription,
  };
  if (inputsAreMissing(inputs, res)) return;
  ///////////////
  const Division = require("../models/Division");
  await Division.create({
    name: inputs.divisionName,
    description: inputs.divisionDescription,
  });
  res.json({ success: "New division created." });
});

router.put("/division/:id", verifyToken, verifyAdmin, async (req, res) => {
  // Request Inputs
  const inputs = {
    idParam: req.params.id,
    divisionName: req.body.divisionName,
    divisionDescription: req.body.divisionDescription,
  };
  if (inputsAreMissing(inputs, res)) return;
  ///////////////
  const Division = require("../models/Division");
  await Division.update(
    { name: inputs.divisionName, description: inputs.divisionDescription },
    {
      where: {
        id: inputs.idParam,
      },
    }
  );
  res.json({ success: "Division updated." });
});

router.delete("/division/:id", verifyToken, verifyAdmin, async (req, res) => {
  // Request Inputs
  const inputs = {
    idParam: req.params.id,
  };
  if (inputsAreMissing(inputs, res)) return;
  ///////////////
  // Check if the division has no employees
  const User = require("../models/User");
  const employeeCount = await User.count({
    where: { divisionId: inputs.idParam },
  });
  if (employeeCount == 0) {
    const Division = require("../models/Division");
    await Division.destroy({
      where: {
        id: inputs.idParam,
      },
    });
    return res.json({ success: "Division deleted." });
  } else {
    return res.status(405).json({
      error: "Division cannot be deleted since there are employees under it.",
    });
  }
});

router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  // Request Inputs
  const inputs = {
    divisionId: req.query.divisionId,
    roleId: req.query.roleId,
    nameLike: req.query.nameLike,
    emailLike: req.query.emailLike,
  };
  ///////////////
  let filter = {};
  const { Op } = require("sequelize");
  if (inputs.divisionId) filter["divisionId"] = inputs.divisionId;
  if (inputs.roleId) filter["roleId"] = inputs.roleId;
  if (inputs.nameLike)
    filter["fullName"] = { [Op.like]: `%${inputs.nameLike.toLowerCase()}%` };
  if (inputs.emailLike)
    filter["email"] = { [Op.like]: `%${inputs.emailLike.toLowerCase()}%` };
  const User = require("../models/User");
  const allUsers = await User.findAll({
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    where: filter,
  });
  // Convert all permissions to JSON object
  allUsers.forEach((user) => {
    user.permissions = JSON.parse(user.permissions);
  });
  res.json(allUsers);
});

router.post("/user", verifyToken, verifyAdmin, async (req, res) => {
  // Request Inputs
  const inputs = {
    userFirstName: req.body.userFirstName,
    userEmail: req.body.userEmail,
    userDivisionId: req.body.userDivisionId,
    userRoleId: req.body.userRoleId,
  };
  if (inputsAreMissing(inputs, res)) return;
  ///////////////
  // Generate a random temporary password
  const tempPassword = Math.random().toString(36).slice(-8);
  // Get role permissions
  const Role = require("../models/Role");
  const selectedRole = await Role.findOne({
    raw: true,
    attributes: ["permissions"],
    where: { id: inputs.userRoleId },
  });
  const User = require("../models/User");
  try {
    await User.create({
      firstName: inputs.userFirstName,
      email: inputs.userEmail,
      password: tempPassword,
      DivisionId: inputs.userDivisionId,
      RoleId: inputs.userRoleId,
      permissions: JSON.parse(selectedRole.permissions),
    });
    // Check if this is the documentation email
    if (
      inputs.userEmail !=
      "please.use.real.email.here.before.trying.out.in.swagger@gmail.com"
    ) {
      const sendEmail = require("../core/email");
      sendEmail(
        inputs.userEmail,
        "VirtualOffice Account Registration",
        `<center>
        <b>Please click the link below to login to your VirtualOffice account,</b><br>
        <a href=${cfg.FRONTEND_URL}>Login to VirtualOffice</a> <br><br>
        Username: ${inputs.userEmail} <br>
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

router.put("/user/:id", verifyToken, verifyAdmin, async (req, res) => {
  // Request Inputs
  const inputs = {
    idParam: req.params.id,
  };
  if (inputsAreMissing(inputs, res)) return;
  ///////////////
  let reqBody = req.body;
  let properties = {};
  if (reqBody.userFirstName) properties["firstName"] = reqBody.userFirstName;
  if (reqBody.userLastName) properties["lastName"] = reqBody.userLastName;
  // Work-around for fullName issue
  const User = require("../models/User");
  const prevData = await User.findOne({
    attributes: ["firstName", "lastName"],
    where: { id: inputs.idParam },
  });
  if (properties.firstName == null)
    properties["firstName"] = prevData.firstName;
  if (properties.lastName == null) properties["lastName"] = prevData.lastName;
  //////////////
  if (reqBody.userEmail) {
    properties["email"] = reqBody.userEmail;
    // Generate a random temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    properties["password"] = tempPassword;
    properties["needsSetup"] = true;
    // Check if this is the documentation email
    if (
      reqBody.userEmail !=
      "please.use.real.email.here.before.trying.out.in.swagger@gmail.com"
    ) {
      const sendEmail = require("../core/email");
      sendEmail(
        reqBody.userEmail,
        "VirtualOffice Account Email/Password Change",
        `<center>
            <b>Please click the link below to login to your VirtualOffice account,</b><br>
            <a href=${cfg.FRONTEND_URL}>Login to VirtualOffice</a> <br><br>
            New Username: ${reqBody.userEmail} <br>
            New Password: ${tempPassword} <br>
            </center>`
      );
    }
  }
  if (reqBody.userDivisionId) properties["DivisionId"] = reqBody.userDivisionId;
  if (reqBody.userRoleId) {
    properties["RoleId"] = reqBody.userRoleId;
    // Need to copy the new role permissions
    const Role = require("../models/Role");
    const selectedRole = await Role.findOne({
      raw: true,
      attributes: ["permissions"],
      where: { id: reqBody.userRoleId },
    });
    properties["permissions"] = JSON.parse(selectedRole.permissions);
  }
  // If permissions are again defined here, it takes priority
  if (reqBody.userPermissions)
    properties["permissions"] = reqBody.userPermissions;
  await User.update(properties, {
    where: {
      id: inputs.idParam,
    },
  });
  res.json({ success: "User updated." });
});

router.get("/roles", verifyToken, verifyAdmin, async (req, res) => {
  const Role = require("../models/Role");
  const allRoles = await Role.findAll({
    raw: true,
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  // Convert all permissions to JSON object
  allRoles.forEach((role) => {
    role.permissions = JSON.parse(role.permissions);
  });
  res.json(allRoles);
});

router.post("/role", verifyToken, verifyAdmin, async (req, res) => {
  // Request Inputs
  const inputs = {
    roleName: req.body.roleName,
    roleDescription: req.body.roleDescription,
    rolePermissions: req.body.rolePermissions, // TODO: PERMISSION STRUCTURE TEST
  };
  if (inputsAreMissing(inputs, res)) return;
  ///////////////
  const Role = require("../models/Role");
  await Role.create({
    name: inputs.roleName,
    description: inputs.roleDescription,
    permissions: inputs.rolePermissions,
  });
  res.json({ success: "New role created." });
});

router.put("/role/:id", verifyToken, verifyAdmin, async (req, res) => {
  // Request Inputs
  const inputs = {
    idParam: req.params.id,
    roleName: req.body.roleName,
    roleDescription: req.body.roleDescription,
    rolePermissions: req.body.rolePermissions, // TODO: PERMISSION STRUCTURE TEST
    overwriteCustomUserPermissions: req.body.overwriteCustomUserPermissions,
  };
  if (inputsAreMissing(inputs, res)) return;
  ///////////////
  const Role = require("../models/Role");
  await Role.update(
    {
      name: inputs.roleName,
      description: inputs.roleDescription,
      permissions: inputs.rolePermissions,
    },
    {
      where: {
        id: inputs.idParam,
      },
    }
  );
  // Overwrite all users with new permissions?
  if (inputs.overwriteCustomUserPermissions) {
    const User = require("../models/User");
    await User.update(
      {
        permissions: inputs.rolePermissions,
      },
      {
        where: {
          roleId: inputs.idParam,
        },
      }
    );
  }
  res.json({ success: "Role updated." });
});

router.delete("/role/:id", verifyToken, verifyAdmin, async (req, res) => {
  // Request Inputs
  const inputs = {
    idParam: req.params.id,
  };
  if (inputsAreMissing(inputs, res)) return;
  ///////////////
  // Check if the division has no employees
  const User = require("../models/User");
  const employeeCount = await User.count({
    where: { roleId: inputs.idParam },
  });
  if (employeeCount == 0) {
    const Role = require("../models/Role");
    await Role.destroy({
      where: {
        id: inputs.idParam,
      },
    });
    return res.json({ success: "Role deleted." });
  } else {
    return res.status(405).json({
      error: "Role cannot be deleted since there are employees under it.",
    });
  }
});

module.exports = router;
