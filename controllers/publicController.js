// PUBLIC CONTROLLER
const cfg = process.env; // Get server configurations

exports.getServerStatus = (req, res) => {
  res.json({
    serverReady: true,
    serverInitialized: cfg.NEEDS_INITIAL_SETUP == "true" ? false : true,
  });
};

exports.getOrganizationInfo = async (req, res) => {
  // Response Body Content
  const resBody = {
    organizationName: "",
    organizationCountry: "",
    organizationContactNumber: "",
    organizationAddress: "",
  };
  ///////////////
  const Settings = require("../models/Settings");
  for (var key in resBody) {
    const setting = await Settings.findOne({
      raw: true,
      attributes: ["voValue"],
      where: { voOption: key },
    });
    resBody[key] = setting.voValue;
  }
  res.json(resBody);
};
