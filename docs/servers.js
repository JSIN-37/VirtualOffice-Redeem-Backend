const cfg = process.env; // Get server configurations

let serverList = [
  {
    url: `https://${cfg.HOST_NAME}:${cfg.HTTPS_PORT}/api`,
    description: "HTTPS",
  },
];

if (cfg.HTTP_ENABLED == "true") {
  serverList.push({
    url: `http://${cfg.HOST_NAME}:${cfg.HTTP_PORT}/api`,
    description: "HTTP",
  });
}

module.exports = {
  servers: serverList,
};
