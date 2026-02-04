'use client';

import { Task } from '../../types/tasks';
import { TaskItem } from './TaskItem';
import ErrorBoundary from '../common/ErrorBoundary';
import { memo } from 'react';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onUpdateTask?: (updatedTask: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onLogout?: () => void;
}

const TaskListComponent = ({ tasks, loading, onUpdateTask, onDeleteTask, onLogout }: TaskListProps) => {
  // Separate completed and incomplete tasks
  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);

  return (
    <div className="space-y-4">
      {/* Incomplete Tasks Section */}
      {incompleteTasks.length > 0 && (
        <section aria-labelledby="incomplete-tasks-heading">
          <h2 id="incomplete-tasks-heading" className="text-lg font-semibold text-gray-900 mb-3">Incomplete Tasks</h2>
          <ul className="space-y-3" role="list" aria-label="Incomplete tasks">
            {incompleteTasks.map(task => (
              <ErrorBoundary key={`task-${task.id}`} fallback={<div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700">Error displaying task: {task.title}</div>}>
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                />
              </ErrorBoundary>
            ))}
          </ul>
        </section>
      )}

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <section aria-labelledby="completed-tasks-heading" className="mt-6">
          <h2 id="completed-tasks-heading" className="text-lg font-semibold text-gray-900 mb-3">Completed Tasks</h2>
          <ul className="space-y-3" role="list" aria-label="Completed tasks">
            {completedTasks.map(task => (
              <ErrorBoundary key={`task-${task.id}`} fallback={<div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700">Error displaying task: {task.title}</div>}>
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                />
              </ErrorBoundary>
            ))}
          </ul>
        </section>
      )}

      {/* Empty State */}
      {tasks.length === 0 && !loading && (
        <div className="text-center py-8">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
        </div>
      )}
    </div>
  );
};

export const TaskList = memo(TaskListComponent);