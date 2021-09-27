module.exports = {
  get: {
    tags: ["Backdoor Operations"],
    summary: "***DEVELOPMENT ONLY***",
    description:
      "Retrieves the root authority certificate for HTTPS. <b>ONLY AVAILABLE IF SERVER IS RUNNING ON DEVELOPMENT MODE.</b>",
    operationId: "backdoorGetCertificate",
    parameters: [],
    responses: {
      200: {
        description: "Certificate file, in PEM format.",
        content: {
          "application/x-pem-file": {
            schema: {
              type: "string",
              format: "binary",
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
