// https://stackoverflow.com/questions/5364928/node-js-require-all-files-in-a-folder

// Load `*.js` under current directory as properties
//  i.e., `User.js` will become `exports['User']` or `exports.User`
require("fs")
  .readdirSync(__dirname + "/")
  .forEach((file) => {
    if (file.match(/\.js$/) !== null && file !== "index.js") {
      var name = file.replace(".js", "");
      exports[name] = require("./" + file);
    }
  });
