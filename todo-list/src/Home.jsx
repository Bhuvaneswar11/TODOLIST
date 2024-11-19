import React, { useEffect, useState } from 'react';
import Create from './Create';
import axios from 'axios';
import {
  BsCircleFill,
  BsFillCheckCircleFill,
  BsFillTrashFill,
  BsPencil,
  BsSave,
} from 'react-icons/bs';

function Home() {
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newTask, setNewTask] = useState('');

  // Fetch todos on component mount
  useEffect(() => {
    axios
      .get('http://localhost:2001/get')
      .then((result) => setTodos(result.data))
      .catch((err) => console.error('Error fetching todos:', err));
  }, []);

  // Handle edit toggle (open edit input)
  const handleEditToggle = (id, task) => {
    setEditingId(id);
    setNewTask(task);
  };

  // Handle save after editing
  const handleSave = (id) => {
    if (!newTask.trim()) return; 
    axios
      .put(`http://localhost:2001/${id}`, { task: newTask })
      .then((result) => {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === id ? { ...todo, task: result.data.task } : todo
          )
        );
        setEditingId(null); 
      })
      .catch((err) => console.error('Error updating todo:', err));
  };

  // Handle delete
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:2001/delete/${id}`)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      })
      .catch((err) => console.error('Error deleting todo:', err));
  };

  // Toggle task completion (strike-through)
  const toggleCompletion = (id, currentStatus) => {
    axios

    .put(`http://localhost:2001/toggle-complete/${id}`, { done: !currentStatus })
      .then(() => {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === id ? { ...todo, done: !currentStatus } : todo
          )
        );
      })
      .catch((err) => console.error('Error toggling completion:', err));
  };

  return (
    <div className="home-container">
      <h2 className="title">Todo List</h2>
      <Create />
      {todos.length === 0 ? (
        <div className="no-record">
          <h4>No records found</h4>
        </div>
      ) : (
        <div className="task-list">
          {todos.map((todo) => (
            <div key={todo._id} className="task">
              {editingId === todo._id ? (
                <div className="edit-task">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="edit-input"
                    placeholder="Edit your task..."
                  />
                  <button
                    onClick={() => handleSave(todo._id)}
                    className="save-button"
                    title="Save changes"
                  >
                    <BsSave />
                  </button>
                </div>
              ) : (
                <div className="task-content">
                  <span
                    className="task-icon-wrapper"
                    onClick={() => toggleCompletion(todo._id, todo.done)}
                  >
                    {todo.done ? (
                      <BsFillCheckCircleFill className="icon task-done-icon" />
                    ) : (
                      <BsCircleFill className="icon task-icon" />
                    )}
                  </span>
                  <p className={todo.done ? 'line-through task-text' : 'task-text'}>
                    {todo.task}
                  </p>
                  <BsPencil
                    className="icon edit-icon"
                    onClick={() => handleEditToggle(todo._id, todo.task)}
                    title="Edit task"
                  />
                </div>
              )}
              <div
                className="task-actions"
                onClick={() => handleDelete(todo._id)}
                title="Delete task"
              >
                <BsFillTrashFill className="icon delete-icon" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
