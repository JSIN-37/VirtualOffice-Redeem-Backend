// EXPRESS
const cfg = process.env; // Get server configurations

const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support application/x-www-form-urlencoded
app.use(cors());

// Get HTTPS Certs
var key, cert;
try {
  key = fs.readFileSync(
    `./cert/${cfg.CERTIFICATE_FOLDER}/${cfg.CERTIFICATE_FOLDER}.key`
  );
  cert = fs.readFileSync(
    `./cert/${cfg.CERTIFICATE_FOLDER}/${cfg.CERTIFICATE_FOLDER}.crt`
  );
} catch (error) {
  console.log(
    "(✖) Error reading certificates. Check if your CERTIFICATE_FOLDER is correct."
  );
  if (cfg.DEBUGGING_MODE) console.log(error);
  process.exit();
}
console.log(`(✔) Loaded certificates from "${cfg.CERTIFICATE_FOLDER}".`);

var certOptions = {
  key: key,
  cert: cert,
};

let httpsServer = https.createServer(certOptions, app);
httpsServer.listen(cfg.HTTPS_PORT, cfg.HOST_NAME, () => {
  console.log(
    `*** HTTPS listening at: https://${cfg.HOST_NAME}:${cfg.HTTPS_PORT}/api`
  );
});
httpsServer.on("error", (error) => {
  console.log(
    "(✖) Error creating HTTPS server on given configuration. Check if your HOST_NAME, HTTPS_PORT is correct."
  );
  if (cfg.DEBUGGING_MODE) console.log(error);
  process.exit();
});

if (cfg.HTTP_ENABLED == "true") {
  console.log(`(!) HTTP is enabled.`);
  let httpServer = http.createServer(app);
  httpServer.listen(cfg.HTTP_PORT, cfg.HOST_NAME, () => {
    console.log(
      `*** HTTP listening at: http://${cfg.HOST_NAME}:${cfg.HTTP_PORT}/api`
    );
  });
  httpServer.on("error", (error) => {
    console.log(
      "(✖) Error creating HTTP server on given configuration. Check if your HOST_NAME, HTTP_PORT is correct."
    );
    if (cfg.DEBUGGING_MODE) console.log(error);
    process.exit();
  });
}

// Serve the uploads folder
app.use("/uploads", express.static(__dirname + "/../uploads"));

// Log all requests
app.use((req, res, next) => {
  // https://stackoverflow.com/questions/12525928/how-to-get-request-path-with-express-req-object
  if (cfg.DEBUGGING_MODE) {
    console.log(
      `*** ${req.protocol.toUpperCase()} ${req.method} ${req.baseUrl}${
        req.path
      }`
    );
    res.on("finish", () => {
      console.log("--------------------------------------------------");
    });
  }
  next();
});
module.exports = app;
