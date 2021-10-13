// BACKDOOR ROUTES
const router = require("express").Router();

const {
  downloadCertificate,
  resetDatabase,
} = require("../controllers/backdoorController");

router.get("/certificate", downloadCertificate);

router.get("/reset", resetDatabase);

module.exports = router;
