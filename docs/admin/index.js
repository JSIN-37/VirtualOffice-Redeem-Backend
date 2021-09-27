const login = require("./login");
const validateToken = require("./validate-token");
const updateOrganizationInfo = require("./update-organization-info");
const updateOrganizationLogo = require("./update-organization-logo");

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
};
