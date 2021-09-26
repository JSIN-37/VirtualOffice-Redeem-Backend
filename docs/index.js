// This loads configuration for Swagger Docs
const basicInfo = require("./basicInfo");
const servers = require("./servers");
const tags = require("./tags");
const components = require("./components");
const todos = require("./todos");

module.exports = {
  ...basicInfo,
  ...servers,
  ...tags,
  ...components,
  ...todos,
};
