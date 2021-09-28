const Sequelize = require("sequelize");
const { db } = require("../core/database");

const User = db.define("User", {
  firstName: { type: Sequelize.STRING, allowNull: false },
  lastName: Sequelize.STRING,
  fullName: {
    type: Sequelize.VIRTUAL,
    get() {
      return `${this.firstName} ${this.lastName}`;
    },
    set(value) {
      throw new Error("Do not try to set the `fullName` value!");
    },
  },
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
  permissions: Sequelize.JSON,
});

// Relations
const Division = require("./Division");
const Role = require("./Role");
User.belongsTo(Division);
User.belongsTo(Role);

module.exports = User;
