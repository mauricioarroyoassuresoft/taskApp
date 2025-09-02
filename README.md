# TaskApp
A simple personal task manager built with HTML, CSS (SCSS), and JavaScript.  
It demonstrates OOP, SOLID principles, RESTful API simulation, and basic database schemas.

---

## Project Structure

- `index.html` → Main HTML file with form and task list.
- `style.scss` / `style.css` → Styles using SCSS variables, nesting, and BEM naming.
- `script.js` → JavaScript logic: classes, API simulation, and UI rendering.
- `tasks.json` → Sample tasks for simulating backend storage.

---

## Code Principles Applied

- **OOP**: `Task` class for task data, `TaskManager` class for managing tasks.  
- **SOLID**:  
  - Single Responsibility: `Task` only stores data, `TaskManager` handles operations.  
  - Open/Closed: Can extend task management without modifying existing code.  
  - Liskov Substitution, Interface Segregation, Dependency Inversion applied by keeping classes modular and methods simple.  
- **Clean Code**: Clear naming, small functions, separation of concerns.

---

## API Simulation

- **GET /tasks** → `fakeApi.getAll()`  
- **POST /tasks** → `fakeApi.post({ title, description })`  
- **PUT /tasks/:id** → `fakeApi.update(id)` (toggle complete)  
- **DELETE /tasks/:id** → `fakeApi.delete(id)`  

All operations manipulate an in-memory array (`TaskManager.tasks`) and update the UI.

---

## Database Simulation

- **SQL Table (`tasks`)**  
```sql
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE
);
```

- **NoSQL Document (MongoDB)**  
```
{
"_id": "unique_id",
"title": "Buy groceries",
"description": "Milk, eggs, bread",
"isCompleted": false
}
```