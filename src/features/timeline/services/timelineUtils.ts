import { DayData } from '../../../shared/types';
import { Task } from '../types';

export const generateWeekDays = (): DayData[] => {
  const today = new Date();
  const days: DayData[] = [];
  
  for (let i = -3; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    days.push({
      date: date.getDate(),
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday: i === 0,
    });
  }
  
  return days;
};

export const generateTimeSlots = (tasks: Task[]): string[] => {
  const wakeUpTask = tasks.find(task => task.isSystemTask && task.title === 'Wake up!');
  const sleepTask = tasks.find(task => task.isSystemTask && task.title === 'Sleep well');
  
  const wakeTime = wakeUpTask?.startTime || '05:30';
  const sleepTime = sleepTask?.startTime || '22:00';
  
  // Generate regular 30-minute intervals from wake to sleep
  const slots = [];
  const wakeHour = parseInt(wakeTime.split(':')[0]);
  const wakeMin = parseInt(wakeTime.split(':')[1]);
  const sleepHour = parseInt(sleepTime.split(':')[0]);
  const sleepMin = parseInt(sleepTime.split(':')[1]);
  
  let currentHour = wakeHour;
  let currentMin = wakeMin;
  
  while (currentHour < sleepHour || (currentHour === sleepHour && currentMin <= sleepMin)) {
    const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
    slots.push(timeStr);
    
    currentMin += 30;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour++;
    }
  }
  
  // Add any specific task times that don't fall on 30-minute boundaries
  const allTaskTimes = new Set<string>();
  tasks.forEach(task => {
    // Only include times for today's tasks
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    if (task.startDate === today) {
      allTaskTimes.add(task.startTime);
      allTaskTimes.add(task.endTime);
    }
  });
  
  allTaskTimes.forEach(time => {
    if (!slots.includes(time)) {
      slots.push(time);
    }
  });
  
  // Sort the final array
  return slots.sort((a, b) => {
    const [hourA, minA] = a.split(':').map(Number);
    const [hourB, minB] = b.split(':').map(Number);
    return (hourA * 60 + minA) - (hourB * 60 + minB);
  });
};

export const getEventColor = (calendar: string): string => {
  switch (calendar) {
    case 'Personal': return '#FFFFFF';
    case 'Work': return '#FF8A4A'; // Orange - same as border
    case 'Family': return '#FFD700'; // Yellow - same as border
    default: return '#FFFFFF';
  }
};

export const getEventBackgroundColor = (calendar: string, isOverlapping?: boolean): string => {
  if (isOverlapping) {
    return 'transparent';
  }
  
  switch (calendar) {
    case 'Personal': return '#2A2A2A';
    case 'Work': return '#2A2A2A';
    case 'Family': return '#2A2A2A';
    default: return '#2A2A2A';
  }
};

export const getEventBorderColor = (calendar: string): string => {
  switch (calendar) {
    case 'Personal': return '#FFFFFF';
    case 'Work': return '#FF8A4A'; // Orange
    case 'Family': return '#FFD700'; // Yellow
    default: return '#FFFFFF';
  }
};

export const getEventHeight = (task: Task): number => {
  if (task.startTime === task.endTime) return 50; // Single time events - height of one time slot
  
  // Calculate height based on time difference
  const [startHour, startMin] = task.startTime.split(':').map(Number);
  const [endHour, endMin] = task.endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  const durationMinutes = endMinutes - startMinutes;
  
  // Each 30-minute slot is 50px high
  return Math.max(50, (durationMinutes / 30) * 50);
};

export const getEventTopPosition = (task: Task, tasks: Task[]): number => {
  const timeSlots = generateTimeSlots(tasks);
  
  const startIndex = timeSlots.indexOf(task.startTime);
  
  if (startIndex === -1) {
    // If task time not found in slots, calculate position based on time difference
    const [startHour, startMin] = task.startTime.split(':').map(Number);
    const wakeUpTask = tasks.find(task => task.isSystemTask && task.title === 'Wake up!');
    const wakeTime = wakeUpTask?.startTime || '05:30';
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const wakeMinutes = wakeHour * 60 + wakeMin;
    const minutesFromWake = startMinutes - wakeMinutes;
    
    return 20 + (minutesFromWake / 30) * 50; // 20px padding + (minutes / 30) * 50px per slot
  }
  
  return 20 + (startIndex * 50); // TimeRail paddingTop (20) + slot position
};

export const formatTimeDisplay = (startTime: string, endTime: string): string => {
  if (startTime === endTime) {
    return startTime;
  }
  return `${startTime}-${endTime}`;
};

/**
 * Detects overlapping events and marks them accordingly
 * @param tasks Array of tasks to check for overlaps
 * @returns Array of tasks with isOverlapping property set
 */
export const detectOverlappingEvents = (tasks: Task[]): Task[] => {
  const tasksWithOverlaps = tasks.map(task => ({ ...task, isOverlapping: false }));
  
  // Sort tasks by start time for easier comparison
  const sortedTasks = tasksWithOverlaps.sort((a, b) => {
    const timeA = a.startTime.split(':').map(Number);
    const timeB = b.startTime.split(':').map(Number);
    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
  });
  
  // Check each task against all subsequent tasks for overlaps
  for (let i = 0; i < sortedTasks.length; i++) {
    const currentTask = sortedTasks[i];
    const currentStart = timeToMinutes(currentTask.startTime);
    const currentEnd = timeToMinutes(currentTask.endTime);
    
    for (let j = i + 1; j < sortedTasks.length; j++) {
      const otherTask = sortedTasks[j];
      const otherStart = timeToMinutes(otherTask.startTime);
      const otherEnd = timeToMinutes(otherTask.endTime);
      
      // Check if tasks overlap (not just touching)
      if (currentEnd > otherStart && currentStart < otherEnd) {
        currentTask.isOverlapping = true;
        otherTask.isOverlapping = true;
      }
    }
  }
  
  return sortedTasks;
};

/**
 * Groups overlapping events into overlap groups for switching
 * Groups events that share the same middle half-hour slot
 * @param tasks Array of tasks to group
 * @returns Map of overlap groups
 */
export const groupOverlappingEvents = (tasks: Task[]): Map<string, Task[]> => {
  const overlapGroups = new Map<string, Task[]>();
  const processedTasks = new Set<string>();
  
  // For each task, find all other tasks that have overlapping middle half-hour periods
  tasks.forEach((task, index) => {
    if (processedTasks.has(task.id)) return;
    
    const startMinutes = timeToMinutes(task.startTime);
    const endMinutes = timeToMinutes(task.endTime);
    const middleMinutes = (startMinutes + endMinutes) / 2;
    
    // Calculate the middle half-hour period (30 minutes centered around the middle)
    const middleHalfHourStart = middleMinutes - 15; // 15 minutes before middle
    const middleHalfHourEnd = middleMinutes + 15;   // 15 minutes after middle
    
    const groupKey = `overlap-${index}`;
    const groupTasks: Task[] = [task];
    processedTasks.add(task.id);
    
    // Find all other tasks that overlap with this task's middle half-hour period
    tasks.forEach(otherTask => {
      if (otherTask.id === task.id || processedTasks.has(otherTask.id)) return;
      
      const otherStartMinutes = timeToMinutes(otherTask.startTime);
      const otherEndMinutes = timeToMinutes(otherTask.endTime);
      const otherMiddleMinutes = (otherStartMinutes + otherEndMinutes) / 2;
      
      // Calculate the other task's middle half-hour period
      const otherMiddleHalfHourStart = otherMiddleMinutes - 15;
      const otherMiddleHalfHourEnd = otherMiddleMinutes + 15;
      
      // Check if the middle half-hour periods overlap
      const overlap = !(middleHalfHourEnd <= otherMiddleHalfHourStart || otherMiddleHalfHourEnd <= middleHalfHourStart);
      
      if (overlap) {
        groupTasks.push(otherTask);
        processedTasks.add(otherTask.id);
      }
    });
    
    // Only create a group if there are multiple tasks
    if (groupTasks.length > 1) {
      overlapGroups.set(groupKey, groupTasks);
    }
  });
  
  return overlapGroups;
};

/**
 * Converts time string (HH:MM) to minutes since midnight
 * @param timeString Time in HH:MM format
 * @returns Minutes since midnight
 */
const timeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Detects if a task's top or bottom border overlaps with other tasks
 * @param task The task to check
 * @param allTasks All tasks in the timeline
 * @returns Object with topBorderOverlap and bottomBorderOverlap flags
 */
export const detectBorderOverlaps = (task: Task, allTasks: Task[]): { topBorderOverlap: boolean; bottomBorderOverlap: boolean } => {
  const taskStartMinutes = timeToMinutes(task.startTime);
  const taskEndMinutes = timeToMinutes(task.endTime);
  
  let topBorderOverlap = false;
  let bottomBorderOverlap = false;
  
  allTasks.forEach(otherTask => {
    if (otherTask.id === task.id) return;
    
    const otherStartMinutes = timeToMinutes(otherTask.startTime);
    const otherEndMinutes = timeToMinutes(otherTask.endTime);
    
    // Check if top border (start time) overlaps with any other task's time range
    // Exclude exact matches (touching events)
    if (taskStartMinutes > otherStartMinutes && taskStartMinutes < otherEndMinutes) {
      topBorderOverlap = true;
    }
    
    // Check if bottom border (end time) overlaps with any other task's time range
    // Exclude exact matches (touching events)
    if (taskEndMinutes > otherStartMinutes && taskEndMinutes < otherEndMinutes) {
      bottomBorderOverlap = true;
    }
  });
  
  return { topBorderOverlap, bottomBorderOverlap };
};
