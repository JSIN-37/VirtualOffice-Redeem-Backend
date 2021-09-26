const login = require("./login");
const checkToken = require("./check-token");

module.exports = {
  "/admin/login": {
    ...login,
  },
  "/admin/check-token": {
    ...checkToken,
  },
};
