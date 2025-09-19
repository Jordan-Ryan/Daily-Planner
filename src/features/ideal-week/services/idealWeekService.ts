import { Task } from '../types';

// Service layer - handles business logic for ideal week templates
export class IdealWeekService {
  // Ideal week template tasks - each day has different planned activities
  private static idealWeekTasks: Task[] = [];

  static async getTasks(day?: number): Promise<Task[]> {
    // Return tasks for the specific day (0 = Monday, 6 = Sunday)
    if (day !== undefined) {
      return this.idealWeekTasks.filter(task => {
        const taskDate = new Date(task.startDate);
        const dayOfWeek = (taskDate.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
        return dayOfWeek === day;
      });
    }
    
    // Return all ideal week tasks
    return [...this.idealWeekTasks];
  }

  static async getTaskById(id: string): Promise<Task | undefined> {
    return this.idealWeekTasks.find(task => task.id === id);
  }

  static async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const taskIndex = this.idealWeekTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    this.idealWeekTasks[taskIndex] = { ...this.idealWeekTasks[taskIndex], ...updates };
    return this.idealWeekTasks[taskIndex];
  }

  static async addTask(task: Omit<Task, 'id'>): Promise<Task> {
    const newTask: Task = {
      ...task,
      id: `ideal-${Date.now()}`,
    };
    this.idealWeekTasks.push(newTask);
    return newTask;
  }

  static async deleteTask(taskId: string): Promise<void> {
    const taskIndex = this.idealWeekTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    this.idealWeekTasks.splice(taskIndex, 1);
  }

  static async getTasksByDay(day: number): Promise<Task[]> {
    return this.getTasks(day);
  }

  static async getTasksByCalendar(calendar: string): Promise<Task[]> {
    return this.idealWeekTasks.filter(task => task.calendar === calendar);
  }

  static async getSystemTasks(): Promise<Task[]> {
    return this.idealWeekTasks.filter(task => task.isSystemTask);
  }

  static async getRecurringTasks(): Promise<Task[]> {
    return this.idealWeekTasks.filter(task => task.isRecurring);
  }

  static async getCompletedTasks(): Promise<Task[]> {
    return this.idealWeekTasks.filter(task => task.complete);
  }

  static async getIncompleteTasks(): Promise<Task[]> {
    return this.idealWeekTasks.filter(task => !task.complete);
  }
}
