module.exports = {
  post: {
    tags: ["Admin Operations"],
    description:
      "Creates a new user. Sends an email with credentials to continue setting up their account.",
    operationId: "adminCreateUser",
    parameters: [],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userFirstName: {
                type: "string",
                example: "Brad",
              },
              userEmail: {
                type: "string",
                example:
                  "please.use.real.email.here.before.trying.out.in.swagger@gmail.com",
              },
              userDivisionId: { type: "integer", example: 1 },
              userRoleId: { type: "integer", example: 1 },
            },
            required: [
              "userFirstName",
              "userEmail",
              "userDivisionId",
              "userRoleId",
            ],
          },
        },
      },
    },
    responses: {
      200: {
        description: "New user created.",
      },
      400: {
        description: "Some required property/s is/are missing in request body.",
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
