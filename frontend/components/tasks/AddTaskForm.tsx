'use client';

import { useState, FormEvent } from 'react';
import { CreateTaskData } from '../../types/tasks';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

interface TaskFormProps {
  onCreateTask: (taskData: CreateTaskData) => Promise<{ success: boolean; data?: any; error?: string }>;
  loading: boolean;
}

const TaskForm = ({ onCreateTask, loading }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setError('');

    const result = await onCreateTask({
      title: title.trim(),
      description: description.trim()
    });

    if (result.success) {
      setTitle('');
      setDescription('');
      setError('');
    } else {
      setError(result.error || 'Failed to create task');
    }
  };

  return (
    <Card className="bg-pastel-purple-50 border-pastel-purple-200 p-6 shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Task</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Name *
          </label>
          <input
            type="text"
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pastel-purple-500 focus:border-pastel-purple-500 sm:text-sm transition-colors duration-200"
            placeholder="Enter task name"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">
            Task Description
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pastel-purple-500 focus:border-pastel-purple-500 sm:text-sm transition-colors duration-200"
            placeholder="Enter task description"
            disabled={loading}
          />
        </div>

        <div>
          <Button
            type="submit"
            className="w-full bg-pastel-purple-500 hover:bg-pastel-purple-600 text-white transition-colors duration-200"
            loading={loading}
            disabled={loading}
            aria-label={loading ? 'Creating task, please wait' : 'Create new task'}
          >
            {loading ? 'Creating Task...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TaskForm;