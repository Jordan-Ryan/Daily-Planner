import { useState, useEffect, useCallback } from 'react';
import { Habit, CompletionEvent, HabitProgress } from '../types';
import { HabitsService } from '../services/habitsService';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [filter, setFilter] = useState<'all' | 'dueToday' | 'timed' | 'negative'>('all');

  const habitsService = HabitsService.getInstance();

  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      const allHabits = habitsService.getHabits();
      setHabits(allHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  }, [habitsService]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const createHabit = useCallback((habitData: Omit<Habit, 'id' | 'state'>) => {
    const newHabit = habitsService.createHabit(habitData);
    setHabits(prev => [...prev, newHabit]);
    return newHabit;
  }, [habitsService]);

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    const updatedHabit = habitsService.updateHabit(id, updates);
    if (updatedHabit) {
      setHabits(prev => prev.map(habit => 
        habit.id === id ? updatedHabit : habit
      ));
    }
    return updatedHabit;
  }, [habitsService]);

  const deleteHabit = useCallback((id: string) => {
    const success = habitsService.deleteHabit(id);
    if (success) {
      setHabits(prev => prev.filter(habit => habit.id !== id));
    }
    return success;
  }, [habitsService]);

  const completeHabit = useCallback((habitId: string, amount: number = 1, durationSec?: number) => {
    const completionEvent = habitsService.completeHabit(habitId, amount, durationSec);
    if (completionEvent) {
      // Reload habits to get updated streaks
      loadHabits();
    }
    return completionEvent;
  }, [habitsService, loadHabits]);

  const getHabitProgress = useCallback((habitId: string) => {
    return habitsService.getTodayProgress(habitId);
  }, [habitsService]);

  const getDueTodayHabits = useCallback(() => {
    return habitsService.getDueTodayHabits();
  }, [habitsService]);

  const getNextDueDate = useCallback((habitId: string) => {
    return habitsService.getNextDueDate(habitId);
  }, [habitsService]);

  const getHabitPresets = useCallback(() => {
    return habitsService.getHabitPresets();
  }, [habitsService]);

  const getHealthRelatedPresets = useCallback(() => {
    return habitsService.getHealthRelatedPresets();
  }, [habitsService]);

  const isHealthRelatedHabit = useCallback((habitData: Partial<Habit>) => {
    return habitsService.isHealthRelatedHabit(habitData);
  }, [habitsService]);

  const handleHabitPress = useCallback((habit: Habit) => {
    setSelectedHabit(habit);
  }, []);

  const getFilteredHabits = useCallback(() => {
    switch (filter) {
      case 'dueToday':
        return habits.filter(habit => 
          habitsService.getDueTodayHabits().some(dueHabit => dueHabit.id === habit.id)
        );
      case 'timed':
        return habits.filter(habit => habit.isTimed);
      case 'negative':
        return habits.filter(habit => habit.isNegative);
      default:
        return habits;
    }
  }, [habits, filter, habitsService]);

  const getHabitsByCategory = useCallback(() => {
    const filtered = getFilteredHabits();
    const dueToday = filtered.filter(habit => 
      habitsService.getDueTodayHabits().some(dueHabit => dueHabit.id === habit.id)
    );
    const completed = filtered.filter(habit => 
      !habitsService.getDueTodayHabits().some(dueHabit => dueHabit.id === habit.id)
    );

    return {
      dueToday,
      completed,
      all: filtered,
    };
  }, [getFilteredHabits, habitsService]);

  return {
    habits,
    loading,
    selectedHabit,
    filter,
    setFilter,
    createHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    getHabitProgress,
    getDueTodayHabits,
    getNextDueDate,
    getHabitPresets,
    getHealthRelatedPresets,
    isHealthRelatedHabit,
    handleHabitPress,
    getFilteredHabits,
    getHabitsByCategory,
    refreshHabits: loadHabits,
  };
};


