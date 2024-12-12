const { TASK_TABLE } = require('../models/task.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkInsert(TASK_TABLE, [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description for Task 1',
        status: 'pending',
        color: 'red',
        favorite: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        title: 'Task 2',
        description: 'Description for Task 2',
        status: 'completed',
        color: 'blue',
        favorite: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        title: 'Task 3',
        description: 'Description for Task 3',
        status: 'in-progress',
        color: 'green',
        favorite: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        title: 'Task 4',
        description: 'Description for Task 4',
        status: 'pending',
        color: 'yellow',
        favorite: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },
  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(TASK_TABLE, null, {});
  }
};
