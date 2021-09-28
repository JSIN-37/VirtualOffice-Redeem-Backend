module.exports = {
  post: {
    tags: ["Admin Operations"],
    description: "Creates a new division.",
    operationId: "adminCreateDivision",
    parameters: [],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              divisionName: {
                type: "string",
                example: "Marketing Division",
              },
              divisionDescription: {
                type: "string",
                example: "Example division, handles marketing.",
              },
            },
            required: ["divisionName", "divisionDescription"],
          },
        },
      },
    },
    responses: {
      200: {
        description: "New division created.",
      },
      400: {
        description: "Some required property/s is/are missing in request body.",
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
