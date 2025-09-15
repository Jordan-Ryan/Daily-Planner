import React from 'react';
import { useTheme } from '../../../shared/hooks/useTheme';
import { HabitsView } from '../views/HabitsView';

interface HabitsScreenProps {
  onAddTask: () => void;
}

export const HabitsScreen: React.FC<HabitsScreenProps> = ({ onAddTask }) => {
  const { theme } = useTheme(true);

  return <HabitsView theme={theme} />;
};
