//model
class Task {
  constructor(id, title, description, isCompleted = false) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.isCompleted = isCompleted;
  }
}

//services
class TaskManager {
  constructor() {
    this.tasks = [];
  }

  async fetchTags(path = "tasks.json") {
    try {
      const response = await fetch(path);
      const data = await response.json();
      this.tasks = (data.tasks || []).map(
        (task) =>
          new Task(
            task.id ?? Date.now(),
            task.title,
            task.description,
            task.isCompleted
          )
      );
    } catch (error) {
      this.tasks = [];
    }
  }

  create(title, description) {
    const id = Date.now();
    const task = new Task(id, title, description, false);
    this.tasks.push(task);
    return task;
  }

  getAll() {
    return this.tasks.slice();
  }

  toggleCompleteTask(id) {
    const foundTask = this.tasks.find((task) => task.id === id);
    if (!foundTask) {
      return null;
    }
    foundTask.isCompleted = !foundTask.isCompleted;
    return foundTask;
  }

  delete(id) {
    const prevLen = this.tasks.length;
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return true;
  }
}
