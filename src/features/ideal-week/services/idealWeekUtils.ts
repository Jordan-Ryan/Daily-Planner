import { Task } from '../types';

export const generateWeekDays = (): { dayName: string; dayIndex: number }[] => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days.map((day, index) => ({
    dayName: day.substring(0, 3), // Mon, Tue, Wed, etc.
    dayIndex: index,
  }));
};

export const generateTimeSlots = (tasks: Task[]): string[] => {
  const wakeUpTask = tasks.find(task => task.isSystemTask && task.title === 'Wake up');
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
    allTaskTimes.add(task.startTime);
    allTaskTimes.add(task.endTime);
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

export const getEventBackgroundColor = (calendar: string): string => {
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
    // If task time not found in slots, calculate position based on time difference from wake time
    const [startHour, startMin] = task.startTime.split(':').map(Number);
    const wakeUpTask = tasks.find(task => task.isSystemTask && task.title === 'Wake up');
    const wakeTime = wakeUpTask?.startTime || '06:00';
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
