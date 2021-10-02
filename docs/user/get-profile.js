module.exports = {
  get: {
    tags: ["User Operations"],
    description: "Gets user's profile.",
    operationId: "userGetProfileInfo",
    parameters: [],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Request successful.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                firstName: {
                  type: "string",
                  example: "John",
                },
                lastName: {
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
                contactNumber: {
                  type: "string",
                  example: "0712345678",
                },
                profilePicture: {
                  type: "string",
                  example: "default.svg",
                },
              },
            },
          },
        },
      },
      401: {
        description: "Authentication failed. Most likely the token is expired.",
      },
      403: {
        description:
          "Token was not sent with the request in the authorization header.",
      },
      500: {
        description:
          "Server error, run server in debugging mode for more information.",
      },
    },
  },
};
