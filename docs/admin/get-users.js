module.exports = {
  get: {
    tags: ["Admin Operations"],
    description:
      "Retrieves all the available users OR retrieve them filtered, if parameters are specified. If none are given, all users are returned. It's upto you to request the way you need data.",
    operationId: "adminGetUsers",
    parameters: [
      {
        name: "divisionId",
        in: "query",
        schema: {
          type: "integer",
          example: 1,
        },
        description: "Filter by given division id.",
      },
      {
        name: "roleId",
        in: "query",
        schema: {
          type: "integer",
          example: 1,
        },
        description: "Filter by given role id.",
      },
      {
        name: "nameLike",
        in: "query",
        schema: {
          type: "string",
          example: "brad tr",
        },
        description:
          "Filter by given name (best matches with both first and last names).",
      },
      {
        name: "emailLike",
        in: "query",
        schema: {
          type: "string",
          example: "brad.r@gm",
        },
        description: "Filter by given email (best match).",
      },
    ],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Request successful.",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "integer",
                    example: "1",
                  },
                  firstName: {
                    type: "string",
                    example: "Brad",
                  },
                  lastName: {
                    type: "string",
                    example: "Traversy",
                  },
                  fullName: {
                    type: "string",
                    example: "Brad Traversy",
                  },
                  dob: {
                    type: "string",
                    example: "1992/01/06",
                  },
                  gender: {
                    type: "string",
                    example: "Male",
                  },
                  address: {
                    type: "string",
                    example: "04/1 Example Road, Example City.",
                  },
                  permissions: {
                    $ref: "#/components/schemas/userPermissions",
                  },
                  needsSetup: {
                    type: "boolean",
                    example: "false",
                  },
                },
              },
            },
          },
        },
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
