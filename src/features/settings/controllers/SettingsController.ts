export interface DaySchedule {
  wakeUpTime: string;
  sleepTime: string;
}

export interface SettingsData {
  // Per-day schedule settings
  dailySchedule: {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
  };
  // Global settings
  darkMode: boolean;
  notifications: boolean;
}

export interface SettingsControllerActions {
  setDaySchedule: (day: keyof SettingsData['dailySchedule'], schedule: DaySchedule) => void;
  setWakeUpTime: (day: keyof SettingsData['dailySchedule'], time: string) => void;
  setSleepTime: (day: keyof SettingsData['dailySchedule'], time: string) => void;
  setDarkMode: (enabled: boolean) => void;
  setNotifications: (enabled: boolean) => void;
  resetSettings: () => void;
}

export class SettingsController {
  private settings: SettingsData = {
    dailySchedule: {
      monday: { wakeUpTime: '06:00', sleepTime: '22:00' },
      tuesday: { wakeUpTime: '06:00', sleepTime: '22:00' },
      wednesday: { wakeUpTime: '06:00', sleepTime: '22:00' },
      thursday: { wakeUpTime: '06:00', sleepTime: '22:00' },
      friday: { wakeUpTime: '06:00', sleepTime: '22:00' },
      saturday: { wakeUpTime: '07:00', sleepTime: '23:00' },
      sunday: { wakeUpTime: '07:00', sleepTime: '23:00' },
    },
    darkMode: true,
    notifications: true,
  };

  private listeners: ((settings: SettingsData) => void)[] = [];

  // Subscribe to settings changes
  subscribe(listener: (settings: SettingsData) => void): () => void {
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
    this.listeners.forEach(listener => listener({ ...this.settings }));
  }

  // Get current settings
  getSettings(): SettingsData {
    return { ...this.settings };
  }

  // Set day schedule
  setDaySchedule(day: keyof SettingsData['dailySchedule'], schedule: DaySchedule): void {
    this.settings.dailySchedule[day] = schedule;
    this.notifyListeners();
  }

  // Set wake up time for specific day
  setWakeUpTime(day: keyof SettingsData['dailySchedule'], time: string): void {
    this.settings.dailySchedule[day].wakeUpTime = time;
    this.notifyListeners();
  }

  // Set sleep time for specific day
  setSleepTime(day: keyof SettingsData['dailySchedule'], time: string): void {
    this.settings.dailySchedule[day].sleepTime = time;
    this.notifyListeners();
  }

  // Set dark mode
  setDarkMode(enabled: boolean): void {
    this.settings.darkMode = enabled;
    this.notifyListeners();
  }

  // Set notifications
  setNotifications(enabled: boolean): void {
    this.settings.notifications = enabled;
    this.notifyListeners();
  }

  // Reset to default settings
  resetSettings(): void {
    this.settings = {
      dailySchedule: {
        monday: { wakeUpTime: '06:00', sleepTime: '22:00' },
        tuesday: { wakeUpTime: '06:00', sleepTime: '22:00' },
        wednesday: { wakeUpTime: '06:00', sleepTime: '22:00' },
        thursday: { wakeUpTime: '06:00', sleepTime: '22:00' },
        friday: { wakeUpTime: '06:00', sleepTime: '22:00' },
        saturday: { wakeUpTime: '07:00', sleepTime: '23:00' },
        sunday: { wakeUpTime: '07:00', sleepTime: '23:00' },
      },
      darkMode: true,
      notifications: true,
    };
    this.notifyListeners();
  }

  // Get actions object for components
  getActions(): SettingsControllerActions {
    return {
      setDaySchedule: this.setDaySchedule.bind(this),
      setWakeUpTime: this.setWakeUpTime.bind(this),
      setSleepTime: this.setSleepTime.bind(this),
      setDarkMode: this.setDarkMode.bind(this),
      setNotifications: this.setNotifications.bind(this),
      resetSettings: this.resetSettings.bind(this),
    };
  }
}
