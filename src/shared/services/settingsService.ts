import { SettingsController, SettingsData, DaySchedule } from '../../features/settings/controllers/SettingsController';

export class SettingsService {
  private static instance: SettingsService;
  private controller: SettingsController;

  private constructor() {
    this.controller = new SettingsController();
  }

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  // Get all settings
  getSettings(): SettingsData {
    return this.controller.getSettings();
  }

  // Get schedule for a specific day
  getDaySchedule(day: keyof SettingsData['dailySchedule']): DaySchedule {
    return this.controller.getSettings().dailySchedule[day];
  }

  // Get wake up time for a specific day
  getWakeUpTime(day: keyof SettingsData['dailySchedule']): string {
    return this.controller.getSettings().dailySchedule[day].wakeUpTime;
  }

  // Get sleep time for a specific day
  getSleepTime(day: keyof SettingsData['dailySchedule']): string {
    return this.controller.getSettings().dailySchedule[day].sleepTime;
  }

  // Subscribe to settings changes
  subscribe(listener: (settings: SettingsData) => void): () => void {
    return this.controller.subscribe(listener);
  }

  // Helper method to get day name from day index (0 = Sunday, 1 = Monday, etc.)
  static getDayNameFromIndex(dayIndex: number): keyof SettingsData['dailySchedule'] {
    const days: (keyof SettingsData['dailySchedule'])[] = [
      'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
    ];
    return days[dayIndex];
  }

  // Helper method to get day name from Date object
  static getDayNameFromDate(date: Date): keyof SettingsData['dailySchedule'] {
    return SettingsService.getDayNameFromIndex(date.getDay());
  }
}
