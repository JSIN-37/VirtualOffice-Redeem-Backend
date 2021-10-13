// ADMIN DIVISION CONTROLLER
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

exports.adminGetDivisions = async (req, res) => {
  const Division = require("../models/Division");
  const allDivisions = await Division.findAll({
    raw: true,
    attributes: ["id", "name", "description"],
  });
  res.json(allDivisions);
};

exports.adminCreateDivision = async (req, res) => {
  // Request Inputs
  const inputs = {
    divisionName: req.body.divisionName,
    divisionDescription: req.body.divisionDescription,
  };
  if (inputsAreMissing(inputs, res)) return;
  ///////////////
  const Division = require("../models/Division");
  await Division.create({
    name: inputs.divisionName,
    description: inputs.divisionDescription,
  });
  res.json({ success: "New division created." });
};

exports.adminUpdateDivision = async (req, res) => {
  // Request Inputs
  const inputs = {
    idParam: req.params.id,
    divisionName: req.body.divisionName,
    divisionDescription: req.body.divisionDescription,
  };
  if (inputsAreMissing(inputs, res)) return;
  ///////////////
  const Division = require("../models/Division");
  await Division.update(
    { name: inputs.divisionName, description: inputs.divisionDescription },
    {
      where: {
        id: inputs.idParam,
      },
    }
  );
  res.json({ success: "Division updated." });
};

exports.adminDeleteDivision = async (req, res) => {
  // Request Inputs
  const inputs = {
    idParam: req.params.id,
  };
  if (inputsAreMissing(inputs, res)) return;
  ///////////////
  // Check if the division has no employees
  const User = require("../models/User");
  const employeeCount = await User.count({
    where: { divisionId: inputs.idParam },
  });
  if (employeeCount == 0) {
    const Division = require("../models/Division");
    await Division.destroy({
      where: {
        id: inputs.idParam,
      },
    });
    return res.json({ success: "Division deleted." });
  } else {
    return res.status(405).json({
      error: "Division cannot be deleted since there are employees under it.",
    });
  }
};
