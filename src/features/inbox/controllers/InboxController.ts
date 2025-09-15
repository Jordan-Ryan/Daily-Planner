import { Task } from '../../timeline/types';

export interface InboxControllerActions {
  toggleTaskComplete: (taskId: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  loadInboxTasks: () => void;
}

export class InboxController {
  private inboxTasks: Task[] = [];
  private listeners: ((tasks: Task[]) => void)[] = [];

  constructor() {
    this.loadInboxTasks();
  }

  // Subscribe to task changes
  subscribe(listener: (tasks: Task[]) => void): () => void {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners of changes
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.inboxTasks]));
  }

  // Get current tasks
  getTasks(): Task[] {
    return [...this.inboxTasks];
  }

  // Get incomplete tasks
  getIncompleteTasks(): Task[] {
    return this.inboxTasks.filter(task => !task.complete);
  }

  // Get completed tasks
  getCompletedTasks(): Task[] {
    return this.inboxTasks.filter(task => task.complete);
  }

  // Toggle task completion
  toggleTaskComplete(taskId: string): void {
    const taskIndex = this.inboxTasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      this.inboxTasks[taskIndex] = {
        ...this.inboxTasks[taskIndex],
        complete: !this.inboxTasks[taskIndex].complete
      };
      this.notifyListeners();
    }
  }

  // Add new task
  addTask(task: Omit<Task, 'id'>): void {
    const newTask: Task = {
      ...task,
      id: `inbox-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    this.inboxTasks.push(newTask);
    this.notifyListeners();
  }

  // Update existing task
  updateTask(taskId: string, updates: Partial<Task>): void {
    const taskIndex = this.inboxTasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      this.inboxTasks[taskIndex] = {
        ...this.inboxTasks[taskIndex],
        ...updates
      };
      this.notifyListeners();
    }
  }

  // Delete task
  deleteTask(taskId: string): void {
    this.inboxTasks = this.inboxTasks.filter(task => task.id !== taskId);
    this.notifyListeners();
  }

  // Load sample inbox tasks
  private loadInboxTasks(): void {
    const sampleTasks: Task[] = [
      {
        id: 'inbox-1',
        icon: '🛒',
        title: 'Buy groceries',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        calendar: 'Personal',
        description: 'Milk, bread, eggs, vegetables',
        complete: false,
        isAllDay: false,
      },
      {
        id: 'inbox-2',
        icon: '📚',
        title: 'Read new book',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        calendar: 'Personal',
        description: 'Finish reading "Atomic Habits"',
        complete: false,
        isAllDay: false,
      },
      {
        id: 'inbox-3',
        icon: '🏃',
        title: 'Plan workout routine',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        calendar: 'Personal',
        description: 'Create weekly exercise schedule',
        complete: true,
        isAllDay: false,
      },
    ];
    this.inboxTasks = sampleTasks;
    this.notifyListeners();
  }

  // Get actions object for components
  getActions(): InboxControllerActions {
    return {
      toggleTaskComplete: this.toggleTaskComplete.bind(this),
      addTask: this.addTask.bind(this),
      updateTask: this.updateTask.bind(this),
      deleteTask: this.deleteTask.bind(this),
      loadInboxTasks: this.loadInboxTasks.bind(this),
    };
  }
}
