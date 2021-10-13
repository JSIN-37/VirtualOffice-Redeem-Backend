// ADMIN ROUTES
const router = require("express").Router();

const { verifyToken, verifyAdmin } = require("../middleware/auth");

const {
  adminLogin,
  adminValidateToken,
  adminUpdateOrganizationInfo,
  adminUpdateOrganizationLogo,
  adminUpdateCredentials,
} = require("../controllers/adminAccountController");
const {
  adminGetDivisions,
  adminCreateDivision,
  adminUpdateDivision,
  adminDeleteDivision,
} = require("../controllers/adminDivisionController");
const {
  adminGetUsers,
  adminCreateUser,
  adminUpdateUser,
} = require("../controllers/adminUserController");
const {
  adminGetRoles,
  adminCreateRole,
  adminUpdateRole,
  adminDeleteRole,
} = require("../controllers/adminRoleController");

// ADMIN > ACCOUNT

router.post("/login", adminLogin);

router.get("/validate-token", verifyToken, verifyAdmin, adminValidateToken);

router.put(
  "/organization-info",
  verifyToken,
  verifyAdmin,
  adminUpdateOrganizationInfo
);

router.put(
  "/organization-logo",
  verifyToken,
  verifyAdmin,
  adminUpdateOrganizationLogo
);

router.put("/credentials", verifyToken, verifyAdmin, adminUpdateCredentials);

// ADMIN > DIVISIONS

router.get("/divisions", verifyToken, verifyAdmin, adminGetDivisions);

router.post("/division", verifyToken, verifyAdmin, adminCreateDivision);

router.put("/division/:id", verifyToken, verifyAdmin, adminUpdateDivision);

router.delete("/division/:id", verifyToken, verifyAdmin, adminDeleteDivision);

// ADMIN > USERS

router.get("/users", verifyToken, verifyAdmin, adminGetUsers);

router.post("/user", verifyToken, verifyAdmin, adminCreateUser);

router.put("/user/:id", verifyToken, verifyAdmin, adminUpdateUser);

// ADMIN > ROLES

router.get("/roles", verifyToken, verifyAdmin, adminGetRoles);

router.post("/role", verifyToken, verifyAdmin, adminCreateRole);

router.put("/role/:id", verifyToken, verifyAdmin, adminUpdateRole);

router.delete("/role/:id", verifyToken, verifyAdmin, adminDeleteRole);

module.exports = router;
