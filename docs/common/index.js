const getAdminEmail = require("../common/get-admin-email");

module.exports = {
  "/common/admin-email": {
    ...getAdminEmail,
  },
};
