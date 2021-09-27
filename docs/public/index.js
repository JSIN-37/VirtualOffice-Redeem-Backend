const getServerStatus = require("./get-server-status");
const getOrganizationInfo = require("../public/get-organization-info");
// const getOrganizationLogo = require("../public/get-organization-logo");

module.exports = {
  "/public/server-status": {
    ...getServerStatus,
  },
  "/public/organization-info": {
    ...getOrganizationInfo,
  },
  // "/public/organization-logo": {
  //   ...getOrganizationLogo,
  // },
};
