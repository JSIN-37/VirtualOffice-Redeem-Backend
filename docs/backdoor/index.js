const getCertificate = require("./get-certificate");
const getReset = require("./get-reset");

module.exports = {
  "/backdoor/certificate": {
    ...getCertificate,
  },
  "/backdoor/reset": {
    ...getReset,
  },
};
