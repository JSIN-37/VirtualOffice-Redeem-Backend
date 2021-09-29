module.exports = {
  components: {
    schemas: {
      userPermissions: {
        type: "object",
        example: {
          component1: {
            permission1: true,
            permission2: false,
            permission3: false,
          },
          component2: {
            permission1: false,
            permission2: false,
            permission3: true,
          },
          component3: {
            permission1: true,
            permission2: false,
            permission3: true,
          },
        },
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
