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

//ui methods
const tasksContainer = document.getElementById("tasksContainer");
const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");

async function renderTasks() {
  tasksContainer.innerHTML = "";
  try {
    const tasks = await fakeApi.getAll();
    if (!tasks.length) {
      const empty = document.createElement("li");
      empty.textContent = "No tasks available.";
      tasksContainer.appendChild(empty);
      return;
    }

    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = task.isCompleted ? "completed" : "";
      li.dataset.id = task.id;

      const left = document.createElement("div");
      left.className = "task-left";
      const titleEl = document.createElement("strong");
      titleEl.textContent = task.title;
      const descEl = document.createElement("div");
      descEl.className = "task-desc";
      descEl.textContent = task.description || "";
      left.appendChild(titleEl);
      left.appendChild(descEl);

      const right = document.createElement("div");
      right.className = "task-buttons";

      const completeBtn = document.createElement("button");
      completeBtn.className = "complete-btn";
      completeBtn.textContent = task.isCompleted ? "Undo" : "Complete";
      completeBtn.addEventListener("click", async () => {
        try {
          await fakeApi.update(task.id);
          await renderTasks();
        } catch (err) {
          console.error(err);
        }
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "X";
      deleteBtn.addEventListener("click", async () => {
        try {
          await fakeApi.delete(task.id);
          await renderTasks();
        } catch (err) {
          console.error(err);
        }
      });

      right.appendChild(completeBtn);
      right.appendChild(deleteBtn);

      li.appendChild(left);
      li.appendChild(right);
      tasksContainer.appendChild(li);
    });
  } catch (err) {
    console.error("Error rendering tasks:", err);
    const errLi = document.createElement("li");
    errLi.textContent = "Error loading tasks.";
    tasksContainer.appendChild(errLi);
  }
}

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  if (!title) return;
  try {
    await fakeApi.post({ title, description });
    titleInput.value = "";
    descriptionInput.value = "";
    await renderTasks();
  } catch (err) {
    console.error("Create task failed:", err);
  }
});

(async function initApp() {
  await fakeApi.init();
  await renderTasks();
})();