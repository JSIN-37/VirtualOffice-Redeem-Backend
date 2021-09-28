module.exports = {
  put: {
    tags: ["Admin Operations"],
    description: "Updates an existing division.",
    operationId: "adminUpdateDivision",
    parameters: [
      {
        name: "id",
        in: "path",
        schema: {
          type: "integer",
          example: 1,
        },
        required: true,
        description: "Id of division to be updated.",
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
              divisionName: {
                type: "string",
                example: "Operations Division",
              },
              divisionDescription: {
                type: "string",
                example: "Example division, handles operations.",
              },
            },
            required: ["divisionName", "divisionDescription"],
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
