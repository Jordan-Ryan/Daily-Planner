// Timeline feature specific types

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  icon: string;
  title: string;
  startDate: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endDate: string;   // YYYY-MM-DD format
  endTime: string;   // HH:MM format
  calendar: string;
  location?: string;
  description?: string;
  subTasks?: SubTask[];
  complete: boolean;
  isOverlapping?: boolean;
  isRecurring?: boolean;
  isSystemTask?: boolean;
  isAllDay?: boolean; // For tasks that span the entire day
}

export interface TimelineEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  calendar: string;
  icon: string;
  isOverlapping?: boolean;
  isRecurring?: boolean;
  isCompleted?: boolean;
}

export interface TimelineState {
  tasks: Task[];
  selectedDate: Date;
  isLoading: boolean;
  error: string | null;
}

export interface TimelineActions {
  toggleTaskComplete: (taskId: string) => void;
  setSelectedDate: (date: Date) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  navigateWeek: (direction: 'prev' | 'next') => void;
}
