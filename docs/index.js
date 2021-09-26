// This loads configuration for Swagger Docs
const basicInfo = require("./basicInfo");
const servers = require("./servers");
const tags = require("./tags");
const components = require("./components");
const admin = require("./admin");
const todos = require("./todos");

module.exports = {
  ...basicInfo,
  ...servers,
  ...tags,
  ...components,
  paths: {
    ...admin,
    ...todos,
  },
};
