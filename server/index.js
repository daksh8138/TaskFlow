const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
let tasks = [
    { id: 1, title: 'Design UI mockups', description: 'Create wireframes for the dashboard', status: 'todo', priority: 'high' },
    { id: 2, title: 'Set up database', description: 'Configure PostgreSQL and create schemas', status: 'todo', priority: 'medium' },
    { id: 3, title: 'Implement authentication', description: 'Add JWT-based user authentication', status: 'in-progress', priority: 'high' },
    { id: 4, title: 'Write API documentation', description: 'Document all REST endpoints', status: 'in-progress', priority: 'low' },
    { id: 5, title: 'Project setup', description: 'Initialize repository and CI/CD pipeline', status: 'done', priority: 'high' },
    { id: 6, title: 'Code review', description: 'Review pull requests from team', status: 'done', priority: 'medium' },
];

let nextId = 7;

// GET /tasks - Retrieve all tasks
app.get('/tasks', (req, res) => {
    res.json({
        success: true,
        data: tasks,
        count: tasks.length
    });
});

// GET /tasks/:id - Retrieve a single task
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));

    if (!task) {
        return res.status(404).json({
            success: false,
            message: 'Task not found'
        });
    }

    res.json({
        success: true,
        data: task
    });
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
    const { title, description, status = 'todo', priority = 'medium' } = req.body;

    if (!title) {
        return res.status(400).json({
            success: false,
            message: 'Title is required'
        });
    }

    const newTask = {
        id: nextId++,
        title,
        description: description || '',
        status,
        priority
    };

    tasks.push(newTask);

    res.status(201).json({
        success: true,
        data: newTask,
        message: 'Task created successfully'
    });
});

// PUT /tasks/:id - Update a task
app.put('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));

    if (taskIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Task not found'
        });
    }

    const { title, description, status, priority } = req.body;

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority })
    };

    res.json({
        success: true,
        data: tasks[taskIndex],
        message: 'Task updated successfully'
    });
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));

    if (taskIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Task not found'
        });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    res.json({
        success: true,
        data: deletedTask,
        message: 'Task deleted successfully'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 TaskFlow API Server running on http://localhost:${PORT}`);
    console.log(`📋 Available endpoints:`);
    console.log(`   GET    /tasks     - Get all tasks`);
    console.log(`   GET    /tasks/:id - Get a single task`);
    console.log(`   POST   /tasks     - Create a new task`);
    console.log(`   PUT    /tasks/:id - Update a task`);
    console.log(`   DELETE /tasks/:id - Delete a task`);
    console.log(`   GET    /health    - Health check`);
});
