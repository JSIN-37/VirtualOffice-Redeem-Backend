// EXPRESS
const cfg = process.env; // Get server configurations

const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");

const app = express();

// Get HTTPS Certs
var key = fs.readFileSync(
  `./cert/${cfg.CERTIFICATE_FOLDER}/${cfg.CERTIFICATE_FOLDER}.key`
);
var cert = fs.readFileSync(
  `./cert/${cfg.CERTIFICATE_FOLDER}/${cfg.CERTIFICATE_FOLDER}.crt`
);
var certOptions = {
  key: key,
  cert: cert,
};

let httpsServer;
httpsServer = https
  .createServer(certOptions, app)
  .listen(cfg.HTTPS_PORT, cfg.HOST_NAME, () => {
    console.log(
      `*** Listening at: https://${cfg.HOST_NAME}:${cfg.HTTPS_PORT}/api`
    );
  });

let httpServer;
if (cfg.HTTP_ENABLED == "true") {
  console.log(`(!) [WARNING] HTTP Enabled.`);
  httpServer = http
    .createServer(app)
    .listen(cfg.HTTP_PORT, cfg.HOST_NAME, () => {
      console.log(`*** Listening at: http://${cfg.HOST_NAME}:${cfg.HTTP_PORT}/api`);
    });
}

module.exports = app;
