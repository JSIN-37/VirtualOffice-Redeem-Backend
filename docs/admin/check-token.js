module.exports = {
  get: {
    tags: ["Admin Operations"],
    description:
      "System administrator token check. An existing token can be sent to verify whether it is still valid (i.e. not expired).",
    operationId: "adminCheckToken",
    parameters: [],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Token is still valid (not expired yet).",
      },
      403: {
        description: "Token was not sent in the authorization header.",
      },
      401: {
        description: "Token has expired.",
      },
      500: {
        description:
          "Server error, run server in debugging mode for more information.",
      },
    },
  },
};
