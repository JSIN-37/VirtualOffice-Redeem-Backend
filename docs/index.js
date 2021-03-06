// This loads configuration for Swagger Docs
const basicInfo = require("./basicInfo");
const servers = require("./servers");
const tags = require("./tags");
const components = require("./components");
const admin = require("./admin");
const common = require("./common");
const public = require("./public");
const backdoor = require("./backdoor");
const user = require("./user");

module.exports = {
  ...basicInfo,
  ...servers,
  ...tags,
  ...components,
  paths: {
    ...admin,
    ...user,
    ...common,
    ...public,
    ...backdoor,
  },
};
