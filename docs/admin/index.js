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
};
