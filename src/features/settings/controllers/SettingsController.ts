export interface SettingsData {
  wakeUpTime: string;
  sleepTime: string;
  darkMode: boolean;
  notifications: boolean;
}

export interface SettingsControllerActions {
  setWakeUpTime: (time: string) => void;
  setSleepTime: (time: string) => void;
  setDarkMode: (enabled: boolean) => void;
  setNotifications: (enabled: boolean) => void;
  resetSettings: () => void;
}

export class SettingsController {
  private settings: SettingsData = {
    wakeUpTime: '05:30',
    sleepTime: '22:00',
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

  // Set wake up time
  setWakeUpTime(time: string): void {
    this.settings.wakeUpTime = time;
    this.notifyListeners();
  }

  // Set sleep time
  setSleepTime(time: string): void {
    this.settings.sleepTime = time;
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
      wakeUpTime: '05:30',
      sleepTime: '22:00',
      darkMode: true,
      notifications: true,
    };
    this.notifyListeners();
  }

  // Get actions object for components
  getActions(): SettingsControllerActions {
    return {
      setWakeUpTime: this.setWakeUpTime.bind(this),
      setSleepTime: this.setSleepTime.bind(this),
      setDarkMode: this.setDarkMode.bind(this),
      setNotifications: this.setNotifications.bind(this),
      resetSettings: this.resetSettings.bind(this),
    };
  }
}
