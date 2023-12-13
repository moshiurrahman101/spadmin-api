const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
const PORT = 5000;

// Middleware to parse JSON requests
app.use(bodyParser.json());
const dataFilePath = 'tasks.json';

// Helper functions for reading and writing data to the JSON file
const readDataFromFile = async () => {
  try {
    const rawData = await fs.readFile(dataFilePath);
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading data from file:', error);
    return [];
  }
};

const writeDataToFile = async (data) => {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    console.log('Data written to file successfully.');
  } catch (error) {
    console.error('Error writing data to file:', error);
  }
};

// Routes for CRUD operations

app.get('/tasks', async (req, res) => {
    const tasks = await readDataFromFile();
    res.json(tasks);
  });

  // add new
  app.post('/tasks', async (req, res) => {
    const newTask = req.body;
    const tasks = await readDataFromFile();
  
    newTask.id = tasks.length + 1;
    tasks.push(newTask);
  
    await writeDataToFile(tasks);
  
    res.json(newTask);
  });
  
  app.put('/tasks/:id', async (req, res) => {
    const updatedTask = req.body;
    const taskId = parseInt(req.params.id);
  
    let tasks = await readDataFromFile();
    const index = tasks.findIndex((task) => task.id === taskId);
  
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedTask };
      await writeDataToFile(tasks);
      res.json(tasks[index]);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  });
  
  app.delete('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);
  
    let tasks = await readDataFromFile();
    const index = tasks.findIndex((task) => task.id === taskId);
  
    if (index !== -1) {
      const deletedTask = tasks.splice(index, 1)[0];
      await writeDataToFile(tasks);
      res.json(deletedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
