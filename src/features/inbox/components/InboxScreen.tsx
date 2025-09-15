import React from 'react';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useInbox } from '../hooks/useInbox';
import { InboxView } from '../views/InboxView';

interface InboxScreenProps {
  onAddTask: () => void;
}

export const InboxScreen: React.FC<InboxScreenProps> = ({ onAddTask }) => {
  const { theme } = useTheme(true);
  const { inboxTasks, incompleteTasks, completedTasks, actions } = useInbox();

  return (
    <InboxView
      theme={theme}
      inboxTasks={inboxTasks}
      incompleteTasks={incompleteTasks}
      completedTasks={completedTasks}
      onToggleTaskComplete={actions.toggleTaskComplete}
    />
  );
};
