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
                example: "john@gmail.com",
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
            required: ["email", "password", "rememberMe"],
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
                user: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      example: 1,
                    },
                    firstName: {
                      type: "string",
                      example: "John",
                    },
                    lastName: {
                      type: "string",
                      example: "Doe",
                    },
                    fullName: {
                      type: "string",
                      example: "Doe",
                    },
                    email: {
                      type: "string",
                      example: "john@gmail.com",
                    },
                    dob: {
                      type: "string",
                      example: "1995/05/01",
                    },
                    gender: {
                      type: "string",
                      example: "Male",
                    },
                    address: {
                      type: "string",
                      example: "8013, Cross Rd., Forest Hills",
                    },
                    permissions: {
                      $ref: "#/components/schemas/userPermissions",
                    },
                    contactNumber: {
                      type: "string",
                      example: "0712345678",
                    },
                    profilePicture: {
                      type: "string",
                      example: "default.svg",
                    },
                    needsSetup: {
                      type: "boolean",
                      example: false,
                    },
                    DivisionId: {
                      type: "integer",
                      example: 1,
                    },
                    RoleId: {
                      type: "integer",
                      example: 1,
                    },
                    DivisionName: {
                      type: "string",
                      example: "Operations Division",
                    },
                    RoleName: {
                      type: "string",
                      example: "Worker",
                    },
                  },
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
