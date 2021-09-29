const login = require("./login");
const validateToken = require("./validate-token");
const updateOrganizationInfo = require("./update-organization-info");
const updateOrganizationLogo = require("./update-organization-logo");
const updateCredentials = require("./update-credentials");
const createDivision = require("./create-division");
const updateDivision = require("./update-division");
const getDivisions = require("./get-divisions");
const deleteDivision = require("./delete-division");
const createUser = require("./create-user");
const getUsers = require("./get-users");
const updateUser = require("./update-user");
const getRoles = require("./get-roles");
const createRole = require("./create-role");
const updateRole = require("./update-role");
const deleteRole = require("./delete-role");

module.exports = {
  "/admin/login": {
    ...login,
  },
  "/admin/validate-token": {
    ...validateToken,
  },
  "/admin/organization-info": {
    ...updateOrganizationInfo,
  },
  "/admin/organization-logo": {
    ...updateOrganizationLogo,
  },
  "/admin/credentials": {
    ...updateCredentials,
  },
  "/admin/divisions": {
    ...getDivisions,
  },
  "/admin/division": {
    ...createDivision,
  },
  "/admin/division/{id}": {
    ...updateDivision,
    ...deleteDivision,
  },
  "/admin/users": {
    ...getUsers,
  },
  "/admin/user": {
    ...createUser,
  },
  "/admin/user/{id}": {
    ...updateUser,
  },
  "/admin/roles": {
    ...getRoles,
  },
  "/admin/role": {
    ...createRole,
  },
  "/admin/role/{id}": {
    ...updateRole,
    ...deleteRole,
  },
};
