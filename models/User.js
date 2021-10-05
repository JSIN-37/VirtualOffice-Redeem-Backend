const Sequelize = require("sequelize");
const { db } = require("../core/database");

const User = db.define("User", {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue("fullName", `${value} ${this.lastName}`);
      this.setDataValue("firstName", value);
    },
  },
  lastName: {
    type: Sequelize.STRING,
    set(value) {
      this.setDataValue("fullName", `${this.firstName} ${value}`);
      this.setDataValue("lastName", value);
    },
  },
  fullName: Sequelize.STRING,
  email: { type: Sequelize.STRING, allowNull: false, unique: true },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    set(value) {
      const hashedPassword = (value) => {
        let hashedPassword = require("crypto")
          .createHash("sha512")
          .update(value)
          .digest("hex");
        return hashedPassword;
      };
      this.setDataValue("password", hashedPassword(value));
    },
  },
  dob: Sequelize.DATEONLY,
  gender: Sequelize.STRING,
  address: Sequelize.STRING,
  contactNumber: Sequelize.STRING,
  profilePicture: { type: Sequelize.STRING, defaultValue: "default.svg" },
  permissions: Sequelize.TEXT('medium'),
  needsSetup: { type: Sequelize.BOOLEAN, defaultValue: true },
});

// Relations
const Division = require("./Division");
const Role = require("./Role");
User.belongsTo(Division);
User.belongsTo(Role);

module.exports = User;
