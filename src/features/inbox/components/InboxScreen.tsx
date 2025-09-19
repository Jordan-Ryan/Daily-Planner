import React from 'react';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useInbox } from '../hooks/useInbox';
import { InboxView } from '../views/InboxView';

export const InboxScreen: React.FC = () => {
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
