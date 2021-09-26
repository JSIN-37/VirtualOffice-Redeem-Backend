const Settings = require("../models/Settings");
const User = require("../models/User");
const Role = require("../models/Role");
const Division = require("../models/Division");

module.exports = async () => {
  console.log("(+) Populating default data...");
  try {
    // First add default settings
    await Settings.bulkCreate([
      {
        voOption: "admin_password",
        voValue:
          "38b2575d2f3cec6d1c8296ee22bdf4bcc658c3bf371d10259b249c5a308f1480bad087d72cf026b78b9ea609a6eb49f3f61ca1ab6540286f36edc3875354f3de",
      },
      {
        voOption: "admin_setup",
        voValue: "",
      },
      {
        voOption: "org_name",
        voValue: "",
      },
      {
        voOption: "org_country",
        voValue: "",
      },
      {
        voOption: "org_contact_number",
        voValue: "",
      },
      {
        voOption: "org_address",
        voValue: "",
      },
      {
        voOption: "org_logo",
        voValue: "",
      },
    ]);
    // Setup the two default roles
    let worker = await Role.create({
      name: "Worker",
      description: "Default Worker role.",
      locked: true,
    });
    let hod = await Role.create({
      name: "Head of Division",
      description: "Default Head of Division role.",
      locked: true,
    });
    // Create a division for the default users
    let division = await Division.create({
      name: "Demo Division",
      description: "Default division.",
    });
    // Create two users for the default roles
    await User.create({
      email: "john@gmail.com",
      password: "virtualoffice@123",
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
      dob: new Date(1995, 11, 17),
      address: "8013, Cross Rd., Forest Hills",
      RoleId: worker.id,
      DivisionId: division.id,
    });
    await User.create({
      email: "sophia@gmail.com",
      password: "virtualoffice@123",
      firstName: "Sophia",
      lastName: "Vergara",
      gender: "Female",
      dob: new Date(1993, 07, 17),
      address: "245, Peachtree Drive, Lakeland",
      RoleId: hod.id,
      DivisionId: division.id,
    });
    console.log("(✔) Default data imported.");
  } catch (error) {
    console.log("(✖) Default data import failed.");
    if (cfg.DEBUGGING_MODE) console.log(error);
  }
};