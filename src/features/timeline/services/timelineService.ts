import { Task } from '../types';
import { TaskModel } from '../models/TaskModel';
import { detectOverlappingEvents } from './timelineUtils';

// Service layer - handles business logic and coordinates with data models
export class TimelineService {
  static async getTasks(date?: string): Promise<Task[]> {
    const tasks = await TaskModel.getAllTasks(date);
    return detectOverlappingEvents(tasks);
  }

  static async getTaskById(id: string): Promise<Task | undefined> {
    return TaskModel.getTaskById(id);
  }

  static async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    return TaskModel.updateTask(taskId, updates);
  }

  static async addTask(task: Omit<Task, 'id'>): Promise<Task> {
    return TaskModel.createTask(task);
  }

  static async deleteTask(taskId: string): Promise<void> {
    return TaskModel.deleteTask(taskId);
  }

  static async getTasksByDate(date: string): Promise<Task[]> {
    const tasks = await TaskModel.getTasksByDate(date);
    return detectOverlappingEvents(tasks);
  }

  static async getTasksByCalendar(calendar: string): Promise<Task[]> {
    return TaskModel.getTasksByCalendar(calendar);
  }

  static async getSystemTasks(): Promise<Task[]> {
    return TaskModel.getSystemTasks();
  }

  static async getRecurringTasks(): Promise<Task[]> {
    return TaskModel.getRecurringTasks();
  }

  static async getCompletedTasks(): Promise<Task[]> {
    return TaskModel.getCompletedTasks();
  }

  static async getIncompleteTasks(): Promise<Task[]> {
    return TaskModel.getIncompleteTasks();
  }
}
