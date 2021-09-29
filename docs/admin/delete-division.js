module.exports = {
  delete: {
    tags: ["Admin Operations"],
    description:
      "Deletes an existing division. This operation only works if there are no employees under that division.",
    operationId: "adminDeleteDivision",
    parameters: [
      {
        name: "id",
        in: "path",
        schema: {
          type: "integer",
          example: 1,
        },
        required: true,
        description: "Id of division to be deleted.",
      },
    ],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Deleting successful.",
      },
      400: {
        description:
          "You did not send the divisionId parameter.",
      },
      405: {
        description:
          "Division cannot be deleted since there are employees under it.",
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
