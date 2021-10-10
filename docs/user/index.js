const getProfile = require("./get-profile");
const login = require("./login");
const updateEmail = require("./update-email");
const updatePassword = require("./update-password");
const updateProfileInfo = require("./update-profile-info");
const updateProfilePic = require("./update-profile-pic");
const validateToken = require("./validate-token");

module.exports = {
  "/user/login": {
    ...login,
  },
  "/user/validate-token": {
    ...validateToken,
  },
  "/user/email": {
    ...updateEmail,
  },
  "/user/password": {
    ...updatePassword,
  },
  "/user/profile": {
    ...getProfile,
  },
  "/user/profile-info": {
    ...updateProfileInfo,
  },
  "/user/profile-pic": {
    ...updateProfilePic,
  },
};
