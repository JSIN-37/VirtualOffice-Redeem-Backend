module.exports = {
  post: {
    tags: ["Admin Operations"],
    description: "Creates a new role.",
    operationId: "adminCreateRole",
    parameters: [],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              roleName: {
                type: "string",
                example: "Director",
              },
              roleDescription: {
                type: "string",
                example: "Overlooks all the available divisions.",
              },
              rolePermissions: { $ref: "#/components/schemas/userPermissions" },
            },
            required: ["roleName", "roleDescription", "rolePermissions"],
          },
        },
      },
    },
    responses: {
      200: {
        description: "New role created.",
      },
      400: {
        description: "Some required property/s is/are missing in request body.",
      },
      405: {
        description: "Role permissions are not in the correct structure.",
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
