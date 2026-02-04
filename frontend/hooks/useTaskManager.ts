'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Task, CreateTaskData, UpdateTaskData } from '../types/tasks';
import { taskApi } from '../lib/api';

export interface TaskManagerState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedTaskId: string | null;
}

export const useTaskManager = () => {
  const [state, setState] = useState<TaskManagerState>({
    tasks: [],
    loading: false,
    error: null,
    selectedTaskId: null,
  });

  // Track ongoing requests to prevent duplicates
  const ongoingRequests = useRef({
    fetchTasks: false,
    createTask: false,
    updateTask: false,
    deleteTask: false,
    toggleTaskCompletion: false,
  });

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (ongoingRequests.current.fetchTasks) {
      return;
    }

    ongoingRequests.current.fetchTasks = true;
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await taskApi.getTasks();

      if (response.success) {
        setState(prev => ({
          ...prev,
          tasks: response.data || [],
          loading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Failed to load tasks',
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'An unexpected error occurred',
      }));
    } finally {
      // Reset the flag regardless of success or failure
      ongoingRequests.current.fetchTasks = false;
    }
  }, []); // No dependencies since taskApi is stable

  const createTask = useCallback(async (taskData: CreateTaskData) => {
    // Prevent multiple simultaneous requests
    if (ongoingRequests.current.createTask) {
      return { success: false, error: 'Request in progress' };
    }

    ongoingRequests.current.createTask = true;
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await taskApi.createTask(taskData);

      if (response.success) {
        setState(prev => ({
          ...prev,
          tasks: [...prev.tasks, response.data],
          loading: false,
        }));
        return { success: true, data: response.data };
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Failed to create task',
        }));
        return { success: false, error: response.error };
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'An unexpected error occurred',
      }));
      return { success: false, error: error.message };
    } finally {
      // Reset the flag regardless of success or failure
      ongoingRequests.current.createTask = false;
    }
  }, []); // No dependencies since taskApi is stable

  const updateTask = useCallback(async (taskId: string, updateData: UpdateTaskData) => {
    // Prevent multiple simultaneous requests
    if (ongoingRequests.current.updateTask) {
      return { success: false, error: 'Request in progress' };
    }

    ongoingRequests.current.updateTask = true;
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await taskApi.updateTask(taskId, updateData);

      if (response.success) {
        setState(prev => ({
          ...prev,
          tasks: prev.tasks.map(task =>
            task.id === taskId ? { ...response.data, updatedAt: new Date().toISOString() } : task
          ),
          loading: false,
        }));
        return { success: true, data: response.data };
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Failed to update task',
        }));
        return { success: false, error: response.error };
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'An unexpected error occurred',
      }));
      return { success: false, error: error.message };
    } finally {
      // Reset the flag regardless of success or failure
      ongoingRequests.current.updateTask = false;
    }
  }, []); // No dependencies since taskApi is stable

  const deleteTask = useCallback(async (taskId: string) => {
    // Prevent multiple simultaneous requests
    if (ongoingRequests.current.deleteTask) {
      return { success: false, error: 'Request in progress' };
    }

    ongoingRequests.current.deleteTask = true;
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await taskApi.deleteTask(taskId);

      if (response.success) {
        setState(prev => ({
          ...prev,
          tasks: prev.tasks.filter(task => task.id !== taskId),
          loading: false,
        }));
        return { success: true };
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Failed to delete task',
        }));
        return { success: false, error: response.error };
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'An unexpected error occurred',
      }));
      return { success: false, error: error.message };
    } finally {
      // Reset the flag regardless of success or failure
      ongoingRequests.current.deleteTask = false;
    }
  }, []); // No dependencies since taskApi is stable

  const toggleTaskCompletion = useCallback(async (taskId: string) => {
    // Prevent multiple simultaneous requests
    if (ongoingRequests.current.toggleTaskCompletion) {
      return { success: false, error: 'Request in progress' };
    }

    ongoingRequests.current.toggleTaskCompletion = true;

    // Find the current task
    const currentTask = state.tasks.find(task => task.id === taskId);
    if (!currentTask) {
      setState(prev => ({
        ...prev,
        error: 'Task not found',
      }));
      // Reset the flag before returning
      ongoingRequests.current.toggleTaskCompletion = false;
      return { success: false, error: 'Task not found' };
    }

    // Optimistically update the UI
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));

    try {
      const response = await taskApi.toggleTaskCompletion(taskId, !currentTask.completed);

      if (response.success) {
        // Update with server response to ensure consistency
        setState(prev => ({
          ...prev,
          tasks: prev.tasks.map(task =>
            task.id === taskId ? response.data : task
          ),
        }));
        return { success: true, data: response.data };
      } else {
        // Revert the optimistic update on failure
        setState(prev => ({
          ...prev,
          tasks: prev.tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ),
          error: response.error || 'Failed to toggle completion',
        }));
        return { success: false, error: response.error };
      }
    } catch (error: any) {
      // Revert the optimistic update on failure
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
        error: error.message || 'An unexpected error occurred',
      }));
      return { success: false, error: error.message };
    } finally {
      // Reset the flag regardless of success or failure
      ongoingRequests.current.toggleTaskCompletion = false;
    }
  }, [state.tasks]); // Depends on state.tasks for finding current task

  const setSelectedTask = useCallback((taskId: string | null) => {
    setState(prev => ({ ...prev, selectedTaskId: taskId }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    setSelectedTask,
    clearError,
  };
};