const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./Models/Todo');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect('mongodb://127.0.0.1:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Routes

// Fetch all todos
app.get('/get', (req, res) => {
  TodoModel.find()
    .then((result) => res.status(200).json(result))
    .catch((err) =>
      res.status(500).json({ error: 'Error fetching todos', details: err })
    );
});

// Add a new todo
app.post('/add', (req, res) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ error: 'Task field is required' });
  }

  TodoModel.create({ task, done: false })
    .then((result) => res.status(201).json(result))
    .catch((err) =>
      res.status(500).json({ error: 'Error adding todo', details: err })
    );
});

// Update a todo (edit task and/or update 'done' status)
app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { task, done } = req.body;

  const updateData = {};
  if (task !== undefined) updateData.task = task;
  if (done !== undefined) updateData.done = done;

  TodoModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true } // Return the updated document
  )
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.status(200).json(result);
    })
    .catch((err) =>
      res.status(500).json({ error: 'Error updating todo', details: err })
    );
});

// Toggle 'done' status
app.put('/toggle-complete/:id', (req, res) => {
  const { id } = req.params;
  const { done } = req.body;

  if (done === undefined) {
    return res.status(400).json({ error: "'done' field is required" });
  }

  TodoModel.findByIdAndUpdate(
    id,
    { done },
    { new: true } // Return the updated document
  )
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.status(200).json(result);
    })
    .catch((err) =>
      res.status(500).json({ error: 'Error updating task status', details: err })
    );
});

// Delete a todo
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  TodoModel.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.status(200).json({ message: 'Todo deleted successfully', result });
    })
    .catch((err) =>
      res.status(500).json({ error: 'Error deleting todo', details: err })
    );
});

// Start the server
app.listen(2001, () => {
  console.log('Server is running on http://localhost:2001');
});
