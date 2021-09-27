module.exports = {
  get: {
    tags: ["Backdoor Operations"],
    summary: "***DEVELOPMENT ONLY***",
    description:
      "Resets the backend and loads default configuration and data. <b>ONLY AVAILABLE IF SERVER IS RUNNING ON DEVELOPMENT MODE.</b>",
    operationId: "backdoorReset",
    parameters: [],
    responses: {
      200: {
        description: "Reset successful.",
      },
      500: {
        description:
          "Server error, run server in debugging mode for more information.",
      },
    },
  },
};
