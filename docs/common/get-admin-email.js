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
                email: {
                  type: "string",
                  example: "virtualoffice.admin@gmail.com",
                },
              },
            },
          },
        },
      },
      401: {
        description: "Authentication failed.",
      },
      500: {
        description:
          "Server error, run server in debugging mode for more information.",
      },
    },
  },
};
