use task_manager;

db.tasks.insertMany([
  {
    title: "Buy groceries",
    description: "Milk, eggs, bread, fruits",
    isCompleted: false,
  },
  {
    title: "Finish homework",
    description: "Complete integrative project for programming class",
    isCompleted: true,
  },
  {
    title: "Workout",
    description: "30 minutes of cardio and stretching",
    isCompleted: false,
  }
]);
