module.exports = {
  post: {
    tags: ["Admin Operations"],
    description: "Updates organization's logo.",
    operationId: "adminUpdateOrganizationLogo",
    parameters: [],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              file: {
                type: "string",
                format: "binary",
              },
            },
            required: ["file"],
          },
        },
      },
    },
    responses: {
      200: {
        description: "Updating successful.",
      },
      400: {
        description: "Missing logo file in request body.",
      },
      401: {
        description: "Authentication failed.",
      },
      500: {
        description:
          "Server error, run server in debugging mode for more information.",
      },
    },
  },
};
