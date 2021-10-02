module.exports = {
  post: {
    tags: ["User Operations"],
    description:
      "User login. Upon successful authentication, a JWT token will be returned that can be used for subsequent API authentication. If rememberMe is set, the token will be generated with a longer expiry.",
    operationId: "userLogin",
    parameters: [],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: {
                type: "string",
                example: "example.user@gmail.com",
              },
              password: {
                type: "string",
                example: "virtualoffice@123",
              },
              rememberMe: {
                type: "boolean",
                example: "true",
              },
            },
            required: ["email", "password"],
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
                userRole: {
                  type: "string",
                  example: "Worker",
                },
                userPermissions: {
                  $ref: "#/components/schemas/userPermissions",
                },
                userNeedsSetup: {
                  type: "boolean",
                  example: false,
                },
              },
            },
          },
        },
      },
      400: {
        description: "Email or password is missing in request body.",
      },
      401: {
        description: "Authentication failed, wrong email or password.",
      },
      500: {
        description:
          "Server error, run server in debugging mode for more information.",
      },
    },
  },
};
