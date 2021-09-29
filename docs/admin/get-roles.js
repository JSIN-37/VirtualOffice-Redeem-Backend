module.exports = {
  get: {
    tags: ["Admin Operations"],
    description: "Retrieves all the available roles and their permissions.",
    operationId: "adminGetRoles",
    parameters: [],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Request successful.",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "integer",
                    example: "1",
                  },
                  name: {
                    type: "string",
                    example: "Director",
                  },
                  description: {
                    type: "string",
                    example: "Overlooks all the available divisions.",
                  },
                  permissions: {
                    $ref: "#/components/schemas/userPermissions",
                  },
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
