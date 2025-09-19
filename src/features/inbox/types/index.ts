// Inbox feature specific types

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoTask {
  id: string;
  icon: string;
  title: string;
  description?: string;
  subTasks?: SubTask[];
  complete: boolean;
  // Rough time estimate in minutes (optional)
  estimatedDuration?: number;
  // Due date (optional) - YYYY-MM-DD format
  dueDate?: string;
  // Priority level (optional)
  priority?: 'low' | 'medium' | 'high';
  // Category/tag for organization
  category?: string;
  // When the task was created
  createdAt: string; // ISO string
  // When the task was last updated
  updatedAt: string; // ISO string
}

export interface InboxState {
  todos: TodoTask[];
  isLoading: boolean;
  error: string | null;
}

export interface InboxActions {
  toggleTaskComplete: (taskId: string) => void;
  addTask: (task: Omit<TodoTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<TodoTask>) => void;
  deleteTask: (taskId: string) => void;
  loadInboxTasks: () => void;
}
