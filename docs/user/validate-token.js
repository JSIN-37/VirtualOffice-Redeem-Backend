module.exports = {
  get: {
    tags: ["User Operations"],
    description:
      "User token validation. An existing token can be sent to verify whether it is still valid (i.e. not expired).",
    operationId: "userValidateToken",
    parameters: [],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Token is still valid (not expired yet).",
      },
      401: {
        description: "Token has expired.",
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
