import { useState, useEffect, useCallback } from 'react';
import { Task, IdealWeekActions } from '../types';
import { IdealWeekService } from '../services/idealWeekService';

export const useIdealWeek = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDay, setSelectedDay] = useState(0); // 0 = Monday, 6 = Sunday
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async (day?: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const dayToLoad = day !== undefined ? day : selectedDay;
      console.log('Loading tasks for day:', dayToLoad, 'Selected day:', selectedDay);
      const fetchedTasks = await IdealWeekService.getTasks(dayToLoad);
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDay]);

  const toggleTaskComplete = useCallback(async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedTask = await IdealWeekService.updateTask(taskId, {
        complete: !task.complete,
      });

      setTasks(prevTasks =>
        prevTasks.map(t => t.id === taskId ? updatedTask : t)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  }, [tasks]);

  const addTask = useCallback(async (task: Omit<Task, 'id'>) => {
    try {
      const newTask = await IdealWeekService.addTask(task);
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
    }
  }, []);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await IdealWeekService.updateTask(taskId, updates);
      setTasks(prevTasks =>
        prevTasks.map(t => t.id === taskId ? updatedTask : t)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await IdealWeekService.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  }, []);

  const setSelectedDayWithReload = useCallback((day: number) => {
    setSelectedDay(day);
    loadTasks(day);
  }, [loadTasks]);

  useEffect(() => {
    // Initial load with Monday (day 0)
    loadTasks(selectedDay);
  }, [loadTasks]);

  const actions: IdealWeekActions = {
    toggleTaskComplete,
    setSelectedDay: setSelectedDayWithReload,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
  };

  return {
    tasks,
    selectedDay,
    isLoading,
    error,
    actions,
  };
};
