// PUBLIC ROUTES
const router = require("express").Router();

const {
  getOrganizationInfo,
  getServerStatus,
} = require("../controllers/publicController");

router.get("/server-status", getServerStatus);

router.get("/organization-info", getOrganizationInfo);

module.exports = router;
