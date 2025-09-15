import React from 'react';
import { useTheme } from '../../../shared/hooks/useTheme';
import { HealthView } from '../views/HealthView';

interface HealthScreenProps {
  onAddTask: () => void;
}

export const HealthScreen: React.FC<HealthScreenProps> = ({ onAddTask }) => {
  const { theme } = useTheme(true);

  return <HealthView theme={theme} />;
};
