const getProfile = require("./get-profile");
const login = require("./login");
const updateEmail = require("./update-email");
const updatePassword = require("./update-password");
const updateProfileInfo = require("./update-profile-info");
const updateProfilePic = require("./update-profile-pic");

module.exports = {
  "/user/login": {
    ...login,
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
