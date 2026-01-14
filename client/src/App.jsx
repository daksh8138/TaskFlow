import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001';

// Priority badge component
const PriorityBadge = ({ priority }) => {
  const colors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${colors[priority]}`}>
      {priority}
    </span>
  );
};

// Task card component
const TaskCard = ({ task, onDelete, onMove }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="task-card glass-card rounded-xl p-4 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-white font-semibold text-sm leading-tight flex-1">
          {task.title}
        </h3>
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && (
        <p className="text-gray-400 text-xs leading-relaxed mb-3">
          {task.description}
        </p>
      )}

      {/* Action buttons */}
      <div className={`flex gap-2 transition-all duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        {task.status !== 'todo' && (
          <button
            onClick={() => onMove(task.id, task.status === 'in-progress' ? 'todo' : 'in-progress')}
            className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
          >
            ← Move Back
          </button>
        )}
        {task.status !== 'done' && (
          <button
            onClick={() => onMove(task.id, task.status === 'todo' ? 'in-progress' : 'done')}
            className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-accent-purple/20 hover:bg-accent-purple/30 text-accent-purple transition-colors"
          >
            Move →
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Column component
const Column = ({ title, tasks, status, headerClass, onDelete, onMove }) => {
  const statusIcons = {
    'todo': '📋',
    'in-progress': '⚡',
    'done': '✅',
  };

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className={`${headerClass} rounded-t-2xl px-5 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{statusIcons[status]}</span>
            <h2 className="text-white font-bold text-lg">{title}</h2>
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-white text-sm font-semibold">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="flex-1 bg-dark-800/50 rounded-b-2xl p-3 space-y-3 overflow-y-auto min-h-[400px] max-h-[calc(100vh-280px)]">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <span className="text-3xl mb-2 opacity-50">📭</span>
            <p className="text-sm">No tasks here</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onMove={onMove}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Add Task Modal
const AddTaskModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({ title, description, priority, status });
    setTitle('');
    setDescription('');
    setPriority('medium');
    setStatus('todo');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="gradient-border w-full max-w-md">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-xl">Create New Task</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-purple transition-colors"
                placeholder="Enter task title..."
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-purple transition-colors resize-none"
                placeholder="Enter task description..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple transition-colors"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple transition-colors"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-accent-purple to-accent-blue py-3 px-6 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity mt-2"
            >
              Create Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();

      if (data.success) {
        setTasks(data.data);
      } else {
        setError('Failed to fetch tasks');
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure the backend is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (data.success) {
        setTasks([...tasks, data.data]);
      }
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setTasks(tasks.filter(t => t.id !== id));
      }
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const moveTask = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
      }
    } catch (err) {
      setError('Failed to move task');
    }
  };

  // Filter tasks by status
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
                <span className="text-white text-xl">📊</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                TaskFlow
              </h1>
            </div>
            <p className="text-gray-400 text-sm">
              Manage your tasks efficiently with our Kanban board
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center gap-2 bg-gradient-to-r from-accent-purple to-accent-blue px-6 py-3 rounded-xl text-white font-semibold shadow-glow-purple hover:shadow-lg transition-all hover:scale-105"
          >
            <span className="text-lg group-hover:rotate-90 transition-transform duration-300">+</span>
            Add Task
          </button>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 flex items-center justify-between">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Column
            title="To Do"
            tasks={todoTasks}
            status="todo"
            headerClass="column-header-todo"
            onDelete={deleteTask}
            onMove={moveTask}
          />
          <Column
            title="In Progress"
            tasks={inProgressTasks}
            status="in-progress"
            headerClass="column-header-progress"
            onDelete={deleteTask}
            onMove={moveTask}
          />
          <Column
            title="Done"
            tasks={doneTasks}
            status="done"
            headerClass="column-header-done"
            onDelete={deleteTask}
            onMove={moveTask}
          />
        </div>
      </main>

      {/* Stats Footer */}
      <footer className="max-w-7xl mx-auto mt-8">
        <div className="glass-card rounded-2xl px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></span>
              <span className="text-gray-400">To Do:</span>
              <span className="text-white font-semibold">{todoTasks.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></span>
              <span className="text-gray-400">In Progress:</span>
              <span className="text-white font-semibold">{inProgressTasks.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600"></span>
              <span className="text-gray-400">Done:</span>
              <span className="text-white font-semibold">{doneTasks.length}</span>
            </div>
            <div className="flex items-center gap-2 border-l border-dark-500 pl-8">
              <span className="text-gray-400">Total:</span>
              <span className="text-white font-bold">{tasks.length}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTask}
      />
    </div>
  );
}

export default App;
