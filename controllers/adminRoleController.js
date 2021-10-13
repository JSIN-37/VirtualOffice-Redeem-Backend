// ADMIN ROLE CONTROLLER
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

exports.adminGetRoles = async (req, res) => {
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
};

exports.adminCreateRole = async (req, res) => {
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
    permissions: JSON.stringify(inputs.rolePermissions),
  });
  res.json({ success: "New role created." });
};

exports.adminUpdateRole = async (req, res) => {
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
      permissions: JSON.stringify(inputs.rolePermissions),
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
        permissions: JSON.stringify(inputs.rolePermissions),
      },
      {
        where: {
          roleId: inputs.idParam,
        },
      }
    );
  }
  res.json({ success: "Role updated." });
};

exports.adminDeleteRole = async (req, res) => {
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
};
