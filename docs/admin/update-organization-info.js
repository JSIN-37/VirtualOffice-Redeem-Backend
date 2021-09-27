module.exports = {
  put: {
    tags: ["Admin Operations"],
    description: "Updates organization's common information.",
    operationId: "adminUpdateOrganizationInfo",
    parameters: [],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              organizationName: {
                type: "string",
                example: "Example Company Inc.",
              },
              organizationCountry: {
                type: "string",
                example: "Sri Lanka",
              },
              organizationContactNumber: {
                type: "string",
                example: "0112345678",
              },
              organizationAddress: {
                type: "string",
                example: "123/1, Example Address, Example City.",
              },
            },
            required: [
              "organizationName",
              "organizationCountry",
              "organizationContactNumber",
              "organizationAddress",
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
        description: "Token was not sent with the request in the authorization header.",
      },
      500: {
        description:
          "Server error, run server in debugging mode for more information.",
      },
    },
  },
};
