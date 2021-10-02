const { examplePermissions } = require("../core/permissions");

module.exports = {
  components: {
    schemas: {
      userPermissions: {
        type: "object",
        example: examplePermissions,
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};
