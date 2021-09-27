module.exports = {
  get: {
    tags: ["Common Operations"],
    description: "Retrieves system administrator's email.",
    operationId: "adminGetCredentials",
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
                adminEmail: {
                  type: "string",
                  example: "virtualoffice.admin@gmail.com",
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
