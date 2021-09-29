module.exports = {
  put: {
    tags: ["Admin Operations"],
    description: `Updates an existing user. Updates are performed on properties that are specified. If none are given, nothing is updated. It's up to you to request the way you need things updated.
      <br> Important: If you update the email of the user, it will regenerate the password for user and send the user an email to setup account again.`,
    operationId: "adminUpdateuser",
    parameters: [
      {
        name: "id",
        in: "path",
        schema: {
          type: "integer",
          example: 1,
        },
        required: true,
        description: "Id of user to be updated.",
      },
    ],
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
              userLastName: {
                type: "string",
                example: "Traversy",
              },
              userEmail: {
                type: "string",
                example:
                  "please.use.real.email.here.before.trying.out.in.swagger@gmail.com",
              },
              userDivisionId: { type: "integer", example: 1 },
              userRoleId: { type: "integer", example: 1 },
              userPermissions: { $ref: "#/components/schemas/userPermissions" },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Updating successful.",
      },
      400: {
        description: "You did not send the userId parameter.",
      },
      405: {
        description: "User permissions are not in the correct structure.",
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
