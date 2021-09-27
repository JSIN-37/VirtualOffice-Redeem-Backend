module.exports = {
  get: {
    tags: ["Public Operations"],
    description: "Gets organization's common information.",
    operationId: "publicGetOrganizationInfo",
    parameters: [],
    responses: {
      200: {
        description: "Request successful.",
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
