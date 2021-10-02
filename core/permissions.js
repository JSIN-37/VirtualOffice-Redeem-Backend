const examplePermissions = {
  tasks: {
    allow: true,
    allDivisions: {
      view: false,
      comment: false,
      createTask: false,
      assignTask: false,
      reviewTask: false,
      editTask: false,
      removeTask: false,
    },
    ownDivision: {
      view: true,
      comment: true,
      createTask: true,
      assignTask: true,
      reviewTask: true,
      editTask: true,
      removeTask: true,
    },
    personal: {
      view: true,
      comment: true,
      createTask: true,
      assignTask: true,
      reviewTask: true,
      editTask: true,
      removeTask: true,
    },
  },
  teams: {
    createTeam: true,
  },
  docs: {
    allow: true,
    publicSharing: false,
  },
};

module.exports = { examplePermissions };
