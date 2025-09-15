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

  private static tasks: Task[] = [
    {
      id: '1',
      icon: '⏰',
      title: 'Wake up!',
      startDate: this.getCurrentDateString(),
      startTime: '05:30',
      endDate: this.getCurrentDateString(),
      endTime: '05:30',
      calendar: 'Personal',
      location: 'Home',
      description: 'Start the day with energy',
      complete: false,
      isRecurring: true,
      isSystemTask: true,
    },
    {
      id: '2',
      icon: '☕',
      title: 'Morning Coffee',
      startDate: this.getCurrentDateString(),
      startTime: '06:00',
      endDate: this.getCurrentDateString(),
      endTime: '06:30',
      calendar: 'Personal',
      location: 'Kitchen',
      description: 'Enjoy a relaxing cup of coffee',
      complete: false,
      isRecurring: true,
    },
    {
      id: '3',
      icon: '🐾',
      title: 'Walk Mel',
      startDate: this.getCurrentDateString(),
      startTime: '07:00',
      endDate: this.getCurrentDateString(),
      endTime: '07:30',
      calendar: 'Personal',
      location: 'Neighborhood Park',
      description: 'Take Mel for his morning walk',
      complete: false,
      isRecurring: true,
    },
    {
      id: '4',
      icon: '💼',
      title: 'Team Standup',
      startDate: this.getCurrentDateString(),
      startTime: '09:00',
      endDate: this.getCurrentDateString(),
      endTime: '09:30',
      calendar: 'Work',
      location: 'Office / Remote',
      description: 'Daily team synchronization meeting',
      complete: false,
      isRecurring: true,
    },
    {
      id: '5',
      icon: '💻',
      title: 'Code Review Session',
      startDate: this.getCurrentDateString(),
      startTime: '10:00',
      endDate: this.getCurrentDateString(),
      endTime: '11:00',
      calendar: 'Work',
      location: 'Office',
      description: 'Review pull requests and provide feedback',
      subTasks: [
        { id: '5a', title: 'Review PR #123', completed: false },
        { id: '5b', title: 'Review PR #124', completed: false },
        { id: '5c', title: 'Update documentation', completed: false }
      ],
      complete: false,
      isRecurring: false,
    },
    {
      id: '6',
      icon: '🍽️',
      title: 'Lunch Break',
      startDate: this.getCurrentDateString(),
      startTime: '12:00',
      endDate: this.getCurrentDateString(),
      endTime: '13:00',
      calendar: 'Personal',
      location: 'Office Cafeteria',
      description: 'Take a break and have lunch',
      complete: false,
      isRecurring: true,
    },
    {
      id: '7',
      icon: '🎯',
      title: 'Product Planning Meeting',
      startDate: this.getCurrentDateString(),
      startTime: '14:00',
      endDate: this.getCurrentDateString(),
      endTime: '15:00',
      calendar: 'Work',
      location: 'Conference Room A',
      description: 'Plan next sprint features and priorities',
      complete: false,
      isRecurring: false,
    },
    {
      id: '8',
      icon: '📚',
      title: 'Esme Dance Class',
      startDate: this.getCurrentDateString(),
      startTime: '15:30',
      endDate: this.getCurrentDateString(),
      endTime: '16:30',
      calendar: 'Family',
      location: 'Dance Studio',
      description: 'Esme\'s weekly ballet class',
      subTasks: [
        { id: '8a', title: 'Drive to studio', completed: false },
        { id: '8b', title: 'Wait during class', completed: false },
        { id: '8c', title: 'Drive home', completed: false }
      ],
      complete: false,
      isRecurring: true,
    },
    {
      id: '9',
      icon: '🏊',
      title: 'Esme Swimming',
      startDate: this.getCurrentDateString(),
      startTime: '17:00',
      endDate: this.getCurrentDateString(),
      endTime: '18:00',
      calendar: 'Family',
      location: 'Community Pool',
      description: 'Esme\'s swimming lesson',
      complete: false,
      isRecurring: true,
    },
    {
      id: '10',
      icon: '🍕',
      title: 'Family Dinner',
      startDate: this.getCurrentDateString(),
      startTime: '19:00',
      endDate: this.getCurrentDateString(),
      endTime: '20:00',
      calendar: 'Family',
      location: 'Home',
      description: 'Cook and enjoy dinner together',
      complete: false,
      isRecurring: true,
    },
    {
      id: '11',
      icon: '📖',
      title: 'Bedtime Stories',
      startDate: this.getCurrentDateString(),
      startTime: '20:30',
      endDate: this.getCurrentDateString(),
      endTime: '21:00',
      calendar: 'Family',
      location: 'Esme\'s Room',
      description: 'Read stories before bedtime',
      complete: false,
      isRecurring: true,
    },
    {
      id: '12',
      icon: '😴',
      title: 'Sleep well',
      startDate: this.getCurrentDateString(),
      startTime: '22:00',
      endDate: this.getCurrentDateString(),
      endTime: '22:00',
      calendar: 'Personal',
      location: 'Home',
      description: 'Wind down and get ready for bed',
      complete: false,
      isRecurring: true,
      isSystemTask: true,
    },
    {
      id: '13',
      icon: '💼',
      title: 'Jordan in Office',
      startDate: this.getCurrentDateString(),
      startTime: '00:00',
      endDate: this.getCurrentDateString(),
      endTime: '23:59',
      calendar: 'Work',
      description: 'Working from the office today',
      complete: false,
      isAllDay: true,
    },
    // Tasks for tomorrow
    {
      id: '14',
      icon: '🏠',
      title: 'Work from Home',
      startDate: this.getDateString(1), // Tomorrow
      startTime: '00:00',
      endDate: this.getDateString(1),
      endTime: '23:59',
      calendar: 'Work',
      description: 'Working from home today',
      complete: false,
      isAllDay: true,
    },
    {
      id: '15',
      icon: '⏰',
      title: 'Wake up!',
      startDate: this.getDateString(1),
      startTime: '06:00',
      endDate: this.getDateString(1),
      endTime: '06:00',
      calendar: 'Personal',
      complete: false,
      isRecurring: true,
      isSystemTask: true,
    },
    {
      id: '16',
      icon: '☕',
      title: 'Morning Coffee',
      startDate: this.getDateString(1),
      startTime: '06:30',
      endDate: this.getDateString(1),
      endTime: '07:00',
      calendar: 'Personal',
      complete: false,
      isRecurring: true,
    },
    // Tasks for day after tomorrow
    {
      id: '17',
      icon: '🏖️',
      title: 'Weekend Plans',
      startDate: this.getDateString(2), // Day after tomorrow
      startTime: '00:00',
      endDate: this.getDateString(2),
      endTime: '23:59',
      calendar: 'Personal',
      description: 'Relaxing weekend activities',
      complete: false,
      isAllDay: true,
    },
    {
      id: '18',
      icon: '⏰',
      title: 'Wake up!',
      startDate: this.getDateString(2),
      startTime: '07:00',
      endDate: this.getDateString(2),
      endTime: '07:00',
      calendar: 'Personal',
      complete: false,
      isRecurring: true,
      isSystemTask: true,
    },
  ];

  static async getAllTasks(date?: string): Promise<Task[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (date) {
      return this.tasks.filter(task => task.startDate === date);
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
