import { Task } from '../types';

export class TaskModel {
  private static getCurrentDateString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  private static getDateString(daysFromToday: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  private static tasks: Task[] = [];

  static async getAllTasks(date?: string): Promise<Task[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('TaskModel.getAllTasks - requested date:', date);
    console.log('TaskModel.getAllTasks - current date string:', this.getCurrentDateString());
    console.log('TaskModel.getAllTasks - total tasks:', this.tasks.length);
    
    if (date) {
      const filteredTasks = this.tasks.filter(task => task.startDate === date);
      console.log('TaskModel.getAllTasks - filtered tasks for date:', filteredTasks.length);
      return filteredTasks;
    }
    
    return [...this.tasks];
  }

  static async getTaskById(id: string): Promise<Task | undefined> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.tasks.find(task => task.id === id);
  }

  static async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newTask: Task = {
      ...task,
      id: (this.tasks.length + 1).toString(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  static async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
    return this.tasks[taskIndex];
  }

  static async deleteTask(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    this.tasks.splice(taskIndex, 1);
  }

  static async getTasksByDate(date: string): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.tasks.filter(task => task.startDate === date);
  }

  static async getTasksByCalendar(calendar: string): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.tasks.filter(task => task.calendar === calendar);
  }

  static async getSystemTasks(): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.tasks.filter(task => task.isSystemTask);
  }

  static async getRecurringTasks(): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.tasks.filter(task => task.isRecurring);
  }

  static async getCompletedTasks(): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.tasks.filter(task => task.complete);
  }

  static async getIncompleteTasks(): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.tasks.filter(task => !task.complete);
  }
}
