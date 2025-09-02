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

//api
const fakeApi = {
  _taskManager: new TaskManager(),

  async init() {
    await this._taskManager.fetchTags("tasks.json");
  },

  async post({ title, description }) {
    if (!title || !title.trim()) {
      return Promise.reject(new Error("Title is required"));
    }
    const task = this._taskManager.create(
      title.trim(),
      (description || "").trim()
    );
    return task;
  },

  async getAll() {
    const tasks = this._taskManager.getAll();
    return tasks;
  },

  async update(id) {
    const task = this._taskManager.toggleCompleteTask(id);
    return task;
  },

  async delete(id) {
    const ok = this._taskManager.delete(id);
    return ok;
  },
};
