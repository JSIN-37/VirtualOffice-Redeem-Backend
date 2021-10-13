// ADMIN USER CONTROLLER
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

exports.adminGetUsers = async (req, res) => {
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
};

exports.adminCreateUser = async (req, res) => {
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
      permissions: selectedRole.permissions,
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
};

exports.adminUpdateUser = async (req, res) => {
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
    properties["permissions"] = selectedRole.permissions;
  }
  // If permissions are again defined here, it takes priority
  if (reqBody.userPermissions)
    properties["permissions"] = JSON.stringify(reqBody.userPermissions);
  await User.update(properties, {
    where: {
      id: inputs.idParam,
    },
  });
  res.json({ success: "User updated." });
};
