import { useState, useEffect, useCallback } from 'react';
import { Task, TimelineActions } from '../types';
import { TimelineService } from '../services/timelineService';

export const useTimeline = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async (date?: Date) => {
    try {
      setIsLoading(true);
      setError(null);
      const dateString = date ? date.toISOString().split('T')[0] : undefined;
      console.log('Loading tasks for date:', dateString, 'Selected date:', selectedDate.toISOString().split('T')[0]);
      const fetchedTasks = await TimelineService.getTasks(dateString);
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  const toggleTaskComplete = useCallback(async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedTask = await TimelineService.updateTask(taskId, {
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
      const newTask = await TimelineService.addTask(task);
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
    }
  }, []);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await TimelineService.updateTask(taskId, updates);
      setTasks(prevTasks =>
        prevTasks.map(t => t.id === taskId ? updatedTask : t)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await TimelineService.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  }, []);

  const setSelectedDateWithReload = useCallback((date: Date) => {
    setSelectedDate(date);
    loadTasks(date);
  }, [loadTasks]);

  const navigateWeek = useCallback((direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setSelectedDateWithReload(newDate);
  }, [selectedDate, setSelectedDateWithReload]);

  useEffect(() => {
    // Initial load with today's date
    loadTasks(selectedDate);
  }, [loadTasks]);

  const actions: TimelineActions = {
    toggleTaskComplete,
    setSelectedDate: setSelectedDateWithReload,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    navigateWeek,
  };

  return {
    tasks,
    selectedDate,
    isLoading,
    error,
    actions,
  };
};
