module.exports = {
  get: {
    tags: ["Admin Operations"],
    description: "Retrieves all the available divisions.",
    operationId: "adminGetDivisions",
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
                  divisionId: {
                    type: "integer",
                    example: "1",
                  },
                  divisionName: {
                    type: "string",
                    example: "Marketing Division",
                  },
                  divisionDescription: {
                    type: "string",
                    example: "Example division, handles marketing.",
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
