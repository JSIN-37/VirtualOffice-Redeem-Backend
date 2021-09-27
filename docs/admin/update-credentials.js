module.exports = {
  put: {
    tags: ["Admin Operations"],
    description:
      "Updates system administrator's email and password. This will also set the flag that admin initialized the system.",
    operationId: "adminUpdateCredentials",
    parameters: [],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              adminEmail: {
                type: "string",
                example: "virtualoffice.admin@gmail.com",
              },
              adminPassword: {
                type: "string",
                example: "virtualoffice@123",
              },
            },
            required: ["adminEmail", "adminPassword"],
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
        description: "Token was not sent with the request in the authorization header.",
      },
      500: {
        description:
          "Server error, run server in debugging mode for more information.",
      },
    },
  },
};
