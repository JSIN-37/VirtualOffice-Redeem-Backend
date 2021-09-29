module.exports = {
  put: {
    tags: ["Admin Operations"],
    description:
      "Updates an existing role. If overwrite is enabled, all current users with this role that have customized individual permissions will be overwritten by the new permissions in the role",
    operationId: "adminUpdateRole",
    parameters: [
      {
        name: "id",
        in: "path",
        schema: {
          type: "integer",
          example: 1,
        },
        required: true,
        description: "Id of role to be updated.",
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
              roleName: {
                type: "string",
                example: "Director",
              },
              roleDescription: {
                type: "string",
                example: "Overlooks all the available divisions.",
              },
              rolePermissions: { $ref: "#/components/schemas/userPermissions" },
              overwriteCustomUserPermissions: {
                type: "boolean",
                example: false,
              },
            },
            required: ["roleName", "roleDescription", "rolePermissions"],
          },
        },
      },
    },
    responses: {
      200: {
        description: "Updating successful.",
      },
      400: {
        description:
          "Some required property/s is/are missing in request body/parameters.",
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
