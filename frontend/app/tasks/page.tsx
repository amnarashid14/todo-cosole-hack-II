'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTaskManager } from '../../hooks/useTaskManager';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { TaskList } from '../../components/tasks/TaskList';
import AddTaskForm from '../../components/tasks/AddTaskForm';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import TaskNavbar from '../../components/tasks/TaskNavbar';
import PendingStatusCard from '../../components/tasks/PendingStatusCard';
import CompletedStatusCard from '../../components/tasks/CompletedStatusCard';
import InProgressStatusCard from '../../components/tasks/InProgressStatusCard';
import { signOut } from '../../lib/auth';

// Mock user data for demonstration
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  firstName: 'John'
};

export default function TasksPage() {
  const router = useRouter();
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setSelectedTask,
    clearError
  } = useTaskManager();

  // Calculate task statistics
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const inProgressTasks = tasks.length; // For now, all tasks are considered in-progress

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []); // Empty dependency array since fetchTasks is stable

  // Handle logout
  const handleLogout = async () => {
    // Use the proper signOut function to clear tokens and notify backend
    await signOut();

    // Then redirect to login
    router.push('/login');
  };

  // Handle task updates
  const handleUpdateTask = (updatedTask: any) => {
    // The update is already handled by the useTaskManager hook
    // This function exists to satisfy the TaskList component interface
  };

  // Handle task deletion
  const handleDeleteTask = (taskId: string) => {
    // The deletion is already handled by the useTaskManager hook
    // This function exists to satisfy the TaskList component interface
  };

  // Handle task submission from the form
  const handleTaskSubmit = (taskData: { name: string; description?: string }) => {
    // Call the existing createTask function but with the new field names
    return createTask({
      title: taskData.name,
      description: taskData.description
    });
  };

  // Ref to focus on the task form
  const taskFormRef = useRef<HTMLDivElement>(null);

  // Global keyboard shortcuts for task operations
  useKeyboardShortcuts([
    {
      key: 'n',
      ctrl: true,
      handler: (e) => {
        e.preventDefault();
        // Focus on the task title input
        const titleInput = taskFormRef.current?.querySelector('#task-name') as HTMLInputElement;
        if (titleInput) titleInput.focus();
      }
    }
  ]);

  return (
    <ProtectedRoute>
      {/* Task Navbar */}
      <TaskNavbar
        userName={mockUser.name}
        userEmail={mockUser.email}
        onLogout={handleLogout}
      />

      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-black mb-2">My Tasks Dashboard</h1>
            <p className="text-gray-600">
              {tasks.length > 0
                ? `You have ${tasks.length} task${tasks.length !== 1 ? 's' : ''} in your list`
                : 'You have no tasks yet. Add your first task below.'}
            </p>
          </div>

          {/* Task Status Cards - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <PendingStatusCard
              title="Pending Tasks"
              count={pendingTasks}
              onClick={() => console.log('Pending tasks clicked')}
            />
            <CompletedStatusCard
              title="Completed Tasks"
              count={completedTasks}
              onClick={() => console.log('Completed tasks clicked')}
            />
            <InProgressStatusCard
              title="In Progress Tasks"
              count={inProgressTasks}
              onClick={() => console.log('In progress tasks clicked')}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={clearError}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Task Creation Form */}
          <div ref={taskFormRef} className="mb-8">
            <AddTaskForm onSubmit={handleTaskSubmit} />
          </div>

          {/* Task List */}
          <div>
            {loading && tasks.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                Loading...
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                loading={loading}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onLogout={handleLogout}
              />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}