/**
 * TypeScript types for task management
 */

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  userId: string;
}

export interface TaskList {
  tasks: Task[];
  totalCount: number;
  filteredCount: number;
}

export type TaskOperationType = 'CREATE' | 'UPDATE' | 'DELETE' | 'TOGGLE_COMPLETE';

export interface TaskOperation {
  type: TaskOperationType;
  taskId?: string;
  payload?: any;
  status: 'PENDING' | 'SUCCESS' | 'ERROR';
  error?: string;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error?: string;
  selectedTaskId?: string;
  operation: TaskOperation;
}

export interface CreateTaskData {
  title: string;
  description?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
}

// New interfaces for Tasks Dashboard UI Redesign

export interface User {
  firstName: string;
  name: string;
  email: string;
}

export interface TaskStatus {
  type: "Pending" | "Completed" | "InProgress";
  title: string;
  count: number;
  colorClass: string;
}

export interface TaskFormData {
  name: string;
  description?: string;
}

export interface TaskFormState {
  taskName: string;
  taskDescription: string;
  errors: {
    taskName?: string;
    taskDescription?: string;
  };
  isSubmitting: boolean;
}

export interface NavbarState {
  user: User;
  isMobileMenuOpen: boolean;
}

export interface TaskNavbarProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
}

export interface StatusCardProps {
  title: string;
  count: number;
  colorClass: string;
  onClick: () => void;
}

export interface AddTaskFormProps {
  onSubmit: (task: TaskFormData) => void;
}