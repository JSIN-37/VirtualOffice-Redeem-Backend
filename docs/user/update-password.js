module.exports = {
  put: {
    tags: ["User Operations"],
    description:
      "Updates user's password. This will also set the flag that user initialized (setup) the account.",
    operationId: "userUpdatePassword",
    parameters: [],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userOldPassword: {
                type: "string",
                example: "virtualoffice@123",
              },
              userNewPassword: {
                type: "string",
                example: "virtualoffice@456",
              },
            },
            required: ["userOldPassword", "userNewPassword"],
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
      405: {
        description: "Incorrect old password.",
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
