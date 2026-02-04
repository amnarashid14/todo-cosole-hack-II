'use client';

import { useState, memo, KeyboardEvent } from 'react';
import { Task } from '../../types/tasks';
import { taskApi } from '../../lib/api';
import { useTaskManager } from '../../hooks/useTaskManager';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import Button from '../../components/ui/Button';

interface TaskItemProps {
  task: Task;
  onUpdate?: (updatedTask: Task) => void;
  onDelete?: (taskId: string) => void;
}

const TaskItemComponent = ({ task, onUpdate, onDelete }: TaskItemProps) => {
  const { toggleTaskCompletion, updateTask, deleteTask } = useTaskManager();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Handle keyboard shortcuts for this task
  useKeyboardShortcuts([
    {
      key: ' ',
      handler: (e) => {
        if (!isEditing && !isUpdating && !isToggling) {
          e.preventDefault();
          handleToggleCompletion();
        }
      }
    },
    {
      key: 'Delete',
      handler: (e) => {
        if (!isEditing && !isDeleting) {
          e.preventDefault();
          handleDelete();
        }
      }
    },
    {
      key: 'e',
      ctrl: true,
      handler: (e) => {
        if (!isEditing && !isUpdating) {
          e.preventDefault();
          setIsEditing(true);
        }
      }
    },
    {
      key: 'Escape',
      handler: (e) => {
        if (isEditing) {
          e.preventDefault();
          handleCancelEdit();
        }
      }
    },
    {
      key: 's',
      ctrl: true,
      handler: (e) => {
        if (isEditing) {
          e.preventDefault();
          handleEdit();
        }
      }
    }
  ]);

  const handleToggleCompletion = async () => {
    setIsToggling(true);
    try {
      await toggleTaskCompletion(task.id);
    } finally {
      setIsToggling(false);
    }
  };

  const handleEdit = async () => {
    setIsUpdating(true);
    try {
      const result = await updateTask(task.id, {
        title: editTitle,
        description: editDescription,
      });

      if (result.success && result.data) {
        onUpdate?.(result.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        const result = await deleteTask(task.id);
        if (result.success) {
          onDelete?.(task.id);
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  // Handle keydown events on the task item container
  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
    // Prevent default behavior for shortcuts we handle
    if ((e.ctrlKey && ['e', 's'].includes(e.key)) ||
        [' ', 'Delete', 'Escape'].includes(e.key)) {
      // We handle these in the global shortcut handler
    }
  };

  return (
    <li
      className={`flex items-start p-4 border rounded-lg ${task.completed ? 'bg-pastel-pink-50' : 'bg-white'} shadow-sm focus:outline-none focus:ring-2 focus-pastel-purple-500`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-start space-x-3 flex-1 min-w-0">
        <div className="relative">
          <input
            type="checkbox"
            id={`complete-${task.id}`}
            checked={task.completed}
            onChange={handleToggleCompletion}
            aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
            className="h-5 w-5 text-pastel-purple-600 rounded mt-0.5 focus:ring-pastel-purple-500 border-pastel-purple-300 cursor-pointer"
            disabled={isUpdating || isToggling}
          />
          {(isToggling) && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <div className="h-3 w-3 border-2 border-pastel-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <>
              <label htmlFor={`edit-title-${task.id}`} className="sr-only">Edit task title</label>
              <input
                type="text"
                id={`edit-title-${task.id}`}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="block w-full px-3 py-2 border border-pastel-purple-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pastel-purple-500 focus:border-pastel-purple-500 sm:text-sm mb-2 bg-white"
                disabled={isUpdating}
                aria-label="Edit task title"
                autoFocus
              />
              <label htmlFor={`edit-desc-${task.id}`} className="sr-only">Edit task description</label>
              <textarea
                id={`edit-desc-${task.id}`}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="block w-full px-3 py-2 border border-pastel-purple-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pastel-purple-500 focus:border-pastel-purple-500 sm:text-sm bg-white"
                rows={2}
                disabled={isUpdating}
                aria-label="Edit task description"
              />
            </>
          ) : (
            <>
              <p
                className={`text-sm font-medium ${task.completed ? 'line-through text-pastel-purple-600' : 'text-gray-800'}`}
                id={`task-title-${task.id}`}
              >
                {task.title}
              </p>
              {task.description && (
                <p
                  className={`mt-1 text-sm ${task.completed ? 'text-pastel-purple-500' : 'text-gray-600'}`}
                  id={`task-desc-${task.id}`}
                >
                  {task.description}
                </p>
              )}
              <div className="mt-2 text-xs text-gray-600" id={`task-created-${task.id}`}>
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex space-x-2 ml-4" role="group" aria-label="Task actions">
        {isEditing ? (
          <>
            <Button
              onClick={handleEdit}
              loading={isUpdating}
              disabled={isUpdating}
              className="px-3 py-1 text-xs"
              aria-label={`Save changes to task "${task.title}"`}
            >
              Save
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isUpdating}
              className="px-3 py-1 text-xs"
              aria-label={`Cancel editing task "${task.title}"`}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              disabled={isUpdating}
              className="px-3 py-1 text-xs"
              aria-label={`Edit task "${task.title}"`}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              loading={isDeleting}
              disabled={isDeleting}
              className="px-3 py-1 text-xs"
              aria-label={`Delete task "${task.title}"`}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </li>
  );
};

export const TaskItem = memo(TaskItemComponent);