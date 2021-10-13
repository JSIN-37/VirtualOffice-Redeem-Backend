// COMMON ROUTES
const router = require("express").Router();

const { verifyToken } = require("../middleware/auth");

const { getAdminEmail } = require("../controllers/commonController");

router.get("/admin-email", verifyToken, getAdminEmail);

module.exports = router;
