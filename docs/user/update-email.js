module.exports = {
  put: {
    tags: ["User Operations"],
    description:
      "Updates user's email. This will send an email (with a new temporary password) to confirm the new email address. Also asks the user to setup the account again.",
    operationId: "userUpdateEmail",
    parameters: [],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userEmail: {
                type: "string",
                example:
                  "please.use.real.email.here.before.trying.out.in.swagger@gmail.com",
              },
            },
            required: ["userEmail"],
          },
        },
      },
    },
    responses: {
      200: {
        description: "Updating successful.",
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
