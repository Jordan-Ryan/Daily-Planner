import { useState, useEffect } from 'react';
import { SettingsController, SettingsData } from '../controllers/SettingsController';

export const useSettings = () => {
  const [settings, setSettings] = useState<SettingsData>({
    wakeUpTime: '05:30',
    sleepTime: '22:00',
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
