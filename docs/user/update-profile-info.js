module.exports = {
  put: {
    tags: ["User Operations"],
    description: "Updates user's profile information.",
    operationId: "userUpdateProfileInfo",
    parameters: [],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userFirstName: {
                type: "string",
                example: "Tom",
              },
              userLastName: {
                type: "string",
                example: "Hanks",
              },
              userDob: {
                type: "string",
                example: "1994/01/17",
              },
              userGender: {
                type: "string",
                example: "Male",
              },
              userAddress: {
                type: "string",
                example: "123/1, Example Address, Example City.",
              },
              userContactNumber: {
                type: "string",
                example: "0712345678",
              },
            },
            required: [
              "userFirstName",
              "userLastName",
              "userDob",
              "userGender",
              "userAddress",
              "userContactNumber",
            ],
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
