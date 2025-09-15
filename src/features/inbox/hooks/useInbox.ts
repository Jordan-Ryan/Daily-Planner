import { useState, useEffect } from 'react';
import { Task } from '../../timeline/types';
import { InboxController } from '../controllers/InboxController';

export const useInbox = () => {
  const [inboxTasks, setInboxTasks] = useState<Task[]>([]);
  const [controller] = useState(() => new InboxController());

  useEffect(() => {
    // Subscribe to controller changes
    const unsubscribe = controller.subscribe((tasks) => {
      setInboxTasks(tasks);
    });

    // Initialize with current tasks
    setInboxTasks(controller.getTasks());

    return unsubscribe;
  }, [controller]);

  const incompleteTasks = inboxTasks.filter(task => !task.complete);
  const completedTasks = inboxTasks.filter(task => task.complete);

  return {
    inboxTasks,
    incompleteTasks,
    completedTasks,
    actions: controller.getActions(),
  };
};
