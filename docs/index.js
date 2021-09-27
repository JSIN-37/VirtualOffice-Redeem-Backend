// This loads configuration for Swagger Docs
const basicInfo = require("./basicInfo");
const servers = require("./servers");
const tags = require("./tags");
const components = require("./components");
const admin = require("./admin");
const common = require("./common");
const public = require("./public");
const backdoor = require("./backdoor");

module.exports = {
  ...basicInfo,
  ...servers,
  ...tags,
  ...components,
  paths: {
    ...admin,
    ...common,
    ...public,
    ...backdoor,
  },
};
