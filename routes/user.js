// USER ROUTES
const router = require("express").Router();

const { verifyToken } = require("../middleware/auth");

const {
  userLogin,
  userValidateToken,
  userUpdateEmail,
  userUpdatePassword,
  userGetProfile,
  userUpdateProfileInfo,
  userUpdateProfilePic,
} = require("../controllers/userAccountController");

router.post("/login", userLogin);

router.get("/validate-token", verifyToken, userValidateToken);

router.put("/email", verifyToken, userUpdateEmail);

router.put("/password", verifyToken, userUpdatePassword);

router.get("/profile", verifyToken, userGetProfile);

router.put("/profile-info", verifyToken, userUpdateProfileInfo);

router.put("/profile-pic", verifyToken, userUpdateProfilePic);

module.exports = router;
