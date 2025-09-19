import { TodoTask, InboxActions } from '../types';

export class InboxController {
  private inboxTasks: TodoTask[] = [];
  private listeners: ((tasks: TodoTask[]) => void)[] = [];

  constructor() {
    this.loadInboxTasks();
  }

  // Subscribe to task changes
  subscribe(listener: (tasks: TodoTask[]) => void): () => void {
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
  getTasks(): TodoTask[] {
    return [...this.inboxTasks];
  }

  // Get incomplete tasks
  getIncompleteTasks(): TodoTask[] {
    return this.inboxTasks.filter(task => !task.complete);
  }

  // Get completed tasks
  getCompletedTasks(): TodoTask[] {
    return this.inboxTasks.filter(task => task.complete);
  }

  // Toggle task completion
  toggleTaskComplete(taskId: string): void {
    const taskIndex = this.inboxTasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      this.inboxTasks[taskIndex] = {
        ...this.inboxTasks[taskIndex],
        complete: !this.inboxTasks[taskIndex].complete,
        updatedAt: new Date().toISOString()
      };
      this.notifyListeners();
    }
  }

  // Add new task
  addTask(task: Omit<TodoTask, 'id' | 'createdAt' | 'updatedAt'>): void {
    const now = new Date().toISOString();
    const newTask: TodoTask = {
      ...task,
      id: `inbox-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now
    };
    this.inboxTasks.push(newTask);
    this.notifyListeners();
  }

  // Update existing task
  updateTask(taskId: string, updates: Partial<TodoTask>): void {
    const taskIndex = this.inboxTasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      this.inboxTasks[taskIndex] = {
        ...this.inboxTasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.notifyListeners();
    }
  }

  // Delete task
  deleteTask(taskId: string): void {
    this.inboxTasks = this.inboxTasks.filter(task => task.id !== taskId);
    this.notifyListeners();
  }

  // Load inbox tasks
  private loadInboxTasks(): void {
    // Start with empty inbox
    this.inboxTasks = [];
    this.notifyListeners();
  }

  // Get actions object for components
  getActions(): InboxActions {
    return {
      toggleTaskComplete: this.toggleTaskComplete.bind(this),
      addTask: this.addTask.bind(this),
      updateTask: this.updateTask.bind(this),
      deleteTask: this.deleteTask.bind(this),
      loadInboxTasks: this.loadInboxTasks.bind(this),
    };
  }
}
