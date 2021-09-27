module.exports = {
  get: {
    tags: ["Public Operations"],
    description: "Returns the server status.",
    operationId: "publicServerStatus",
    parameters: [],
    responses: {
      200: {
        description: "Request successful.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                ready: {
                  type: "boolean",
                  example: true,
                  description: "Server state.",
                },
                initialized: {
                  type: "boolean",
                  example: true,
                  description:
                    "Whether the initial setup is done by the administrator.",
                },
              },
            },
          },
        },
      },
      500: {
        description:
          "Server error, run server in debugging mode for more information.",
      },
    },
  },
};
