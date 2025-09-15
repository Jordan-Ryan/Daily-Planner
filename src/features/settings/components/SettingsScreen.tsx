import React from 'react';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useSettings } from '../hooks/useSettings';
import { SettingsView } from '../views/SettingsView';

interface SettingsScreenProps {
  onAddTask: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onAddTask }) => {
  const { theme } = useTheme(true);
  const { settings, actions } = useSettings();

  return (
    <SettingsView
      theme={theme}
      settings={settings}
      actions={actions}
    />
  );
};
