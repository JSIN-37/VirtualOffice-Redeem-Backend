// USER ACCOUNT CONTROLLER
const cfg = process.env; // Get server configurations

// TODO: Might be a global thing in the future
const inputsAreMissing = (inputs, res) => {
  for (var key in inputs) {
    if (inputs[key] == null) {
      res.status(400).json({
        error:
          "Request body/query/parameters is missing required data. Please refer documentation.",
      });
      return true;
    }
  }
  return false;
};

exports.userLogin = async (req, res) => {
  // Request Inputs
  const inputs = {
    email: req.body.email,
    password: req.body.password,
    rememberMe: req.body.rememberMe,
  };
  if (inputsAreMissing(inputs, res)) return;
  ///////////////
  const expireTime = inputs.rememberMe == true ? "2d" : "24h";
  const hashedPassword = require("crypto")
    .createHash("sha512")
    .update(inputs.password)
    .digest("hex");
  // Get logged in user from database
  const User = require("../models/User");
  const loginUser = await User.findOne({
    raw: true,
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    where: { email: inputs.email, password: hashedPassword },
  });
  if (loginUser) {
    // Parse permissions into JSON object
    loginUser.permissions = JSON.parse(loginUser.permissions);
    // Get DivisionName, RoleName
    const Division = require("../models/Division");
    const userDivision = await Division.findOne({
      raw: true,
      attributes: ["name"],
      where: { id: loginUser.DivisionId },
    });
    loginUser["DivisionName"] = userDivision.name;
    const Role = require("../models/Role");
    const userRole = await Role.findOne({
      raw: true,
      attributes: ["name"],
      where: { id: loginUser.RoleId },
    });
    loginUser["RoleName"] = userRole.name;
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      {
        id: loginUser.id,
        roleId: loginUser.RoleId,
        divisionId: loginUser.DivisionId,
      },
      cfg.JWT_KEY,
      {
        expiresIn: expireTime,
      }
    );
    return res.json({ token, user: loginUser });
  } else res.status(401).json({ error: "User login failed." });
};

exports.userValidateToken = (req, res) => {
  res.json({ success: "Token is still valid." });
};

exports.userUpdateEmail = async (req, res) => {
  // Request User Details
  const reqUser = req.authData;
  // Request Inputs
  const inputs = {
    userEmail: req.body.userEmail,
  };
  if (inputsAreMissing(inputs, res)) return;
  ///////////////
  let properties = {};
  properties["email"] = inputs.userEmail;
  // Generate a random temporary password
  const tempPassword = Math.random().toString(36).slice(-8);
  properties["password"] = tempPassword;
  properties["needsSetup"] = true;
  // Check if this is the documentation email
  if (
    inputs.userEmail !=
    "please.use.real.email.here.before.trying.out.in.swagger@gmail.com"
  ) {
    const sendEmail = require("../core/email");
    sendEmail(
      inputs.userEmail,
      "VirtualOffice Account Email Change",
      `<center>
              <b>Please click the link below to login to your VirtualOffice account,</b><br>
              <a href=${cfg.FRONTEND_URL}>Login to VirtualOffice</a> <br><br>
              New Username: ${inputs.userEmail} <br>
              New Password: ${tempPassword} <br>
              </center>`
    );
  }
  const User = require("../models/User");
  await User.update(properties, {
    where: {
      id: reqUser.id,
    },
  });
  res.json({ success: "Email updated." });
};

exports.userUpdatePassword = async (req, res) => {
  // Request User Details
  const reqUser = req.authData;
  // Request Inputs
  const inputs = {
    userOldPassword: req.body.userOldPassword,
    userNewPassword: req.body.userNewPassword,
  };
  if (inputsAreMissing(inputs, res)) return;
  ///////////////
  const hashedPassword = require("crypto")
    .createHash("sha512")
    .update(inputs.userOldPassword)
    .digest("hex");
  // Get logged in user from database
  const User = require("../models/User");
  const loginUser = await User.findOne({
    raw: true,
    attributes: ["password"],
    where: { id: reqUser.id, password: hashedPassword },
  });
  if (loginUser) {
    await User.update(
      { password: inputs.userNewPassword, needsSetup: false },
      {
        where: {
          id: reqUser.id,
        },
      }
    );
    return res.json({ success: "Password updated." });
  }
  return res.status(405).json({ error: "Incorrect old password." });
};

exports.userGetProfile = async (req, res) => {
  // Request User Details
  const reqUser = req.authData;
  ////////////
  const User = require("../models/User");
  const loginUser = await User.findOne({
    raw: true,
    attributes: [
      "firstName",
      "lastName",
      "email",
      "dob",
      "gender",
      "address",
      "contactNumber",
      "profilePicture",
    ],
    where: { id: reqUser.id },
  });
  return res.json(loginUser);
};

exports.userUpdateProfileInfo = async (req, res) => {
  // Request User Details
  const reqUser = req.authData;
  // Request Inputs
  const inputs = {
    userFirstName: req.body.userFirstName,
    userLastName: req.body.userLastName,
    userDob: req.body.userDob,
    userGender: req.body.userGender,
    userAddress: req.body.userAddress,
    userContactNumber: req.body.userContactNumber,
  };
  if (inputsAreMissing(inputs, res)) return;
  ///////////////
  const User = require("../models/User");
  await User.update(
    {
      firstName: inputs.userFirstName,
      lastName: inputs.userLastName,
      dob: inputs.userDob,
      gender: inputs.userGender,
      address: inputs.userAddress,
      contactNumber: inputs.userContactNumber,
    },
    {
      where: {
        id: reqUser.id,
      },
    }
  );
  return res.json({ success: "User profile info updated." });
};

exports.userUpdateProfilePic = async (req, res) => {
  // Request User Details
  const reqUser = req.authData;
  ///////////
  // Get current profile pic
  const User = require("../models/User");
  const loginUser = await User.findOne({
    raw: true,
    attributes: ["profilePicture"],
    where: { id: reqUser.id },
  });
  const { uploadProfilePic } = require("../core/uploads");
  uploadProfilePic(req, res, async (err) => {
    // Request Inputs
    const inputs = {
      file: req.file,
    };
    if (inputsAreMissing(inputs, res)) return;
    ////////////////////
    if (err) {
      if (cfg.DEBUGGING_MODE) console.log(err);
      return res
        .status(400)
        .json({ error: "Updating profile picture failed." });
    }
    // Delete profile picture if it isn't the default
    if (loginUser.profilePicture != "default.svg") {
      const fs = require("fs");
      try {
        fs.unlinkSync(
          __dirname + `/../uploads/profile-pics/${loginUser.profilePicture}`
        );
      } catch (error) {
        console.log("(✖) Error deleting a profile picture from uploads.");
      }
    }
    // Update database with new profile picture
    await User.update(
      { profilePicture: inputs.file.filename },
      { where: { id: reqUser.id } }
    );
    return res.json({ success: "User profile picture updated." });
  });
};
