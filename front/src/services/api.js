// src/services/api.js
const API_URL = 'http://localhost:5000/api';

const getAllTodos = async () => {
  const response = await fetch(`${API_URL}/todos`);
  return response.json();
};

const createTodo = async (text) => {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return response.json();
};

const updateTodo = async (id, updates) => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return response.json();
};

const deleteTodo = async (id) => {
  await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
};

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo
};
