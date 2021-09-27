const getOrganizationInfo = require("../public/get-organization-info");
// const getOrganizationLogo = require("../public/get-organization-logo");

module.exports = {
  "/public/organization-info": {
    ...getOrganizationInfo,
  },
  // "/public/organization-logo": {
  //   ...getOrganizationLogo,
  // },
};
