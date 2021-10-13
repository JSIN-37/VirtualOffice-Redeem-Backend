// COMMON CONTROLLER
const cfg = process.env; // Get server configurations

const { verifyToken } = require("../middleware/auth");

exports.getAdminEmail = async (req, res) => {
  // Response Body Content
  const resBody = {
    adminEmail: "",
  };
  ///////////////
  const Settings = require("../models/Settings");
  const setting = await Settings.findOne({
    raw: true,
    attributes: ["voValue"],
    where: { voOption: "adminEmail" },
  });
  resBody["adminEmail"] = setting.voValue;
  res.json(resBody);
};
