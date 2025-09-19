import { useState, useEffect } from 'react';
import { SettingsController, SettingsData } from '../controllers/SettingsController';

export const useSettings = () => {
  const [settings, setSettings] = useState<SettingsData>({
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
  });
  const [controller] = useState(() => new SettingsController());

  useEffect(() => {
    // Subscribe to controller changes
    const unsubscribe = controller.subscribe((newSettings) => {
      setSettings(newSettings);
    });

    // Initialize with current settings
    setSettings(controller.getSettings());

    return unsubscribe;
  }, [controller]);

  return {
    settings,
    actions: controller.getActions(),
  };
};
