module.exports = {
  delete: {
    tags: ["Admin Operations"],
    description:
      "Deletes an existing role. This operation only works if there are no employees under that role.",
    operationId: "adminDeleteRole",
    parameters: [
      {
        name: "id",
        in: "path",
        schema: {
          type: "integer",
          example: 1,
        },
        required: true,
        description: "Id of role to be deleted.",
      },
    ],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Deleting successful.",
      },
      400: {
        description: "You did not send the roleId parameter.",
      },
      405: {
        description:
          "Role cannot be deleted since there are employees under it.",
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
