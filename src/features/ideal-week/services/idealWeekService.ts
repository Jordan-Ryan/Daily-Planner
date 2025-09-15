import { Task } from '../types';

// Service layer - handles business logic for ideal week templates
export class IdealWeekService {
  // Ideal week template tasks - each day has different planned activities
  private static idealWeekTasks: Task[] = [
    // Monday - Start of work week
    {
      id: 'ideal-monday-1',
      icon: '⏰',
      title: 'Wake up',
      startDate: '2024-01-01', // Placeholder date
      startTime: '06:00',
      endDate: '2024-01-01',
      endTime: '06:00',
      calendar: 'Personal',
      description: 'Start the week with energy',
      complete: false,
      isSystemTask: true,
    },
    {
      id: 'ideal-monday-2',
      icon: '🏃',
      title: 'Morning Run',
      startDate: '2024-01-01',
      startTime: '06:30',
      endDate: '2024-01-01',
      endTime: '07:30',
      calendar: 'Personal',
      description: '30-minute morning run to start the week',
      complete: false,
    },
    {
      id: 'ideal-monday-3',
      icon: '💼',
      title: 'Work Focus Time',
      startDate: '2024-01-01',
      startTime: '09:00',
      endDate: '2024-01-01',
      endTime: '12:00',
      calendar: 'Work',
      description: 'Deep work session - no meetings',
      complete: false,
    },
    {
      id: 'ideal-monday-4',
      icon: '🍽️',
      title: 'Meal Prep',
      startDate: '2024-01-01',
      startTime: '18:00',
      endDate: '2024-01-01',
      endTime: '19:00',
      calendar: 'Personal',
      description: 'Prepare meals for the week',
      complete: false,
    },
    {
      id: 'ideal-monday-5',
      icon: '😴',
      title: 'Sleep well',
      startDate: '2024-01-01',
      startTime: '22:00',
      endDate: '2024-01-01',
      endTime: '22:00',
      calendar: 'Personal',
      description: 'Wind down and get ready for bed',
      complete: false,
      isSystemTask: true,
    },

    // Tuesday - Gym day
    {
      id: 'ideal-tuesday-1',
      icon: '⏰',
      title: 'Wake up',
      startDate: '2024-01-02',
      startTime: '06:00',
      endDate: '2024-01-02',
      endTime: '06:00',
      calendar: 'Personal',
      description: 'Start the day fresh',
      complete: false,
      isSystemTask: true,
    },
    {
      id: 'ideal-tuesday-2',
      icon: '🏋️',
      title: 'Gym Session',
      startDate: '2024-01-02',
      startTime: '18:00',
      endDate: '2024-01-02',
      endTime: '19:30',
      calendar: 'Personal',
      description: 'Strength training workout',
      complete: false,
    },
    {
      id: 'ideal-tuesday-3',
      icon: '📚',
      title: 'Reading Time',
      startDate: '2024-01-02',
      startTime: '20:00',
      endDate: '2024-01-02',
      endTime: '21:00',
      calendar: 'Personal',
      description: 'Read for 1 hour before bed',
      complete: false,
    },
    {
      id: 'ideal-tuesday-4',
      icon: '😴',
      title: 'Sleep well',
      startDate: '2024-01-02',
      startTime: '22:00',
      endDate: '2024-01-02',
      endTime: '22:00',
      calendar: 'Personal',
      description: 'Wind down and get ready for bed',
      complete: false,
      isSystemTask: true,
    },

    // Wednesday - Mid-week break
    {
      id: 'ideal-wednesday-1',
      icon: '⏰',
      title: 'Wake up',
      startDate: '2024-01-03',
      startTime: '06:30',
      endDate: '2024-01-03',
      endTime: '06:30',
      calendar: 'Personal',
      description: 'Slightly later start mid-week',
      complete: false,
      isSystemTask: true,
    },
    {
      id: 'ideal-wednesday-2',
      icon: '🧘',
      title: 'Meditation',
      startDate: '2024-01-03',
      startTime: '07:00',
      endDate: '2024-01-03',
      endTime: '07:30',
      calendar: 'Personal',
      description: 'Mindfulness and meditation',
      complete: false,
    },
    {
      id: 'ideal-wednesday-3',
      icon: '🎯',
      title: 'Weekly Planning',
      startDate: '2024-01-03',
      startTime: '19:00',
      endDate: '2024-01-03',
      endTime: '20:00',
      calendar: 'Personal',
      description: 'Review and plan the rest of the week',
      complete: false,
    },
    {
      id: 'ideal-wednesday-4',
      icon: '😴',
      title: 'Sleep well',
      startDate: '2024-01-03',
      startTime: '22:00',
      endDate: '2024-01-03',
      endTime: '22:00',
      calendar: 'Personal',
      description: 'Wind down and get ready for bed',
      complete: false,
      isSystemTask: true,
    },

    // Thursday - Social day
    {
      id: 'ideal-thursday-1',
      icon: '⏰',
      title: 'Wake up',
      startDate: '2024-01-04',
      startTime: '06:00',
      endDate: '2024-01-04',
      endTime: '06:00',
      calendar: 'Personal',
      description: 'Early start for social day',
      complete: false,
      isSystemTask: true,
    },
    {
      id: 'ideal-thursday-2',
      icon: '👥',
      title: 'Social Time',
      startDate: '2024-01-04',
      startTime: '19:00',
      endDate: '2024-01-04',
      endTime: '21:00',
      calendar: 'Personal',
      description: 'Meet friends or family',
      complete: false,
    },
    {
      id: 'ideal-thursday-3',
      icon: '😴',
      title: 'Sleep well',
      startDate: '2024-01-04',
      startTime: '22:00',
      endDate: '2024-01-04',
      endTime: '22:00',
      calendar: 'Personal',
      description: 'Wind down and get ready for bed',
      complete: false,
      isSystemTask: true,
    },

    // Friday - End of work week
    {
      id: 'ideal-friday-1',
      icon: '⏰',
      title: 'Wake up',
      startDate: '2024-01-05',
      startTime: '06:00',
      endDate: '2024-01-05',
      endTime: '06:00',
      calendar: 'Personal',
      description: 'TGIF!',
      complete: false,
      isSystemTask: true,
    },
    {
      id: 'ideal-friday-2',
      icon: '🍕',
      title: 'Friday Night Out',
      startDate: '2024-01-05',
      startTime: '19:00',
      endDate: '2024-01-05',
      endTime: '22:00',
      calendar: 'Personal',
      description: 'Celebrate the end of the work week',
      complete: false,
    },
    {
      id: 'ideal-friday-3',
      icon: '😴',
      title: 'Sleep well',
      startDate: '2024-01-05',
      startTime: '23:00',
      endDate: '2024-01-05',
      endTime: '23:00',
      calendar: 'Personal',
      description: 'Later bedtime for Friday night',
      complete: false,
      isSystemTask: true,
    },

    // Saturday - Weekend activities
    {
      id: 'ideal-saturday-1',
      icon: '⏰',
      title: 'Wake up',
      startDate: '2024-01-06',
      startTime: '08:00',
      endDate: '2024-01-06',
      endTime: '08:00',
      calendar: 'Personal',
      description: 'Sleep in on weekends',
      complete: false,
      isSystemTask: true,
    },
    {
      id: 'ideal-saturday-2',
      icon: '🛒',
      title: 'Grocery Shopping',
      startDate: '2024-01-06',
      startTime: '10:00',
      endDate: '2024-01-06',
      endTime: '11:30',
      calendar: 'Personal',
      description: 'Weekly grocery shopping',
      complete: false,
    },
    {
      id: 'ideal-saturday-3',
      icon: '🏠',
      title: 'House Cleaning',
      startDate: '2024-01-06',
      startTime: '14:00',
      endDate: '2024-01-06',
      endTime: '16:00',
      calendar: 'Personal',
      description: 'Weekly house cleaning',
      complete: false,
    },
    {
      id: 'ideal-saturday-4',
      icon: '🎬',
      title: 'Movie Night',
      startDate: '2024-01-06',
      startTime: '20:00',
      endDate: '2024-01-06',
      endTime: '22:30',
      calendar: 'Personal',
      description: 'Watch a movie or series',
      complete: false,
    },
    {
      id: 'ideal-saturday-5',
      icon: '😴',
      title: 'Sleep well',
      startDate: '2024-01-06',
      startTime: '23:00',
      endDate: '2024-01-06',
      endTime: '23:00',
      calendar: 'Personal',
      description: 'Relaxed weekend bedtime',
      complete: false,
      isSystemTask: true,
    },

    // Sunday - Rest and preparation
    {
      id: 'ideal-sunday-1',
      icon: '⏰',
      title: 'Wake up',
      startDate: '2024-01-07',
      startTime: '08:30',
      endDate: '2024-01-07',
      endTime: '08:30',
      calendar: 'Personal',
      description: 'Relaxed Sunday morning',
      complete: false,
      isSystemTask: true,
    },
    {
      id: 'ideal-sunday-2',
      icon: '☕',
      title: 'Coffee & Planning',
      startDate: '2024-01-07',
      startTime: '09:00',
      endDate: '2024-01-07',
      endTime: '10:00',
      calendar: 'Personal',
      description: 'Plan the upcoming week',
      complete: false,
    },
    {
      id: 'ideal-sunday-3',
      icon: '🚶',
      title: 'Nature Walk',
      startDate: '2024-01-07',
      startTime: '15:00',
      endDate: '2024-01-07',
      endTime: '16:30',
      calendar: 'Personal',
      description: 'Relaxing walk in nature',
      complete: false,
    },
    {
      id: 'ideal-sunday-4',
      icon: '📖',
      title: 'Reading & Relaxation',
      startDate: '2024-01-07',
      startTime: '19:00',
      endDate: '2024-01-07',
      endTime: '21:00',
      calendar: 'Personal',
      description: 'Quiet time with a good book',
      complete: false,
    },
    {
      id: 'ideal-sunday-5',
      icon: '😴',
      title: 'Sleep well',
      startDate: '2024-01-07',
      startTime: '22:00',
      endDate: '2024-01-07',
      endTime: '22:00',
      calendar: 'Personal',
      description: 'Early bedtime to prepare for the week',
      complete: false,
      isSystemTask: true,
    },
  ];

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
