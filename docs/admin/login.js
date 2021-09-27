module.exports = {
  post: {
    tags: ["Admin Operations"],
    description:
      "System administrator login. Upon successful authentication, a JWT token will be returned that can be used for subsequent API authentication.",
    operationId: "adminLogin",
    parameters: [],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              password: {
                type: "string",
                example: "virtualoffice@123",
              },
              rememberMe: {
                type: "boolean",
                example: "true",
              },
            },
            required: ["password"],
          },
        },
      },
    },
    responses: {
      200: {
        description: "Authentication successful.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  example:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjp0cnVlLCJpYXQiOjE2MzI2ODU1OTYsImV4cCI6MTYzMjY5Mjc5Nn0.gAea59R6Lx7oIc7s3E1Mc1AiI1RQMEcxny7_xkZTGVA",
                },
              },
            },
          },
        },
      },
      400: {
        description: "Password is missing in request body.",
      },
      401: {
        description: "Authentication failed, wrong password.",
      },
      500: {
        description:
          "Server error, run server in debugging mode for more information.",
      },
    },
  },
};
