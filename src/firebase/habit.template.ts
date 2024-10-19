import {
  type HabitTableData,
  Unit,
  Frequency,
  type NotificationPreference,
  type ProcessLog,
  type CompletionLog
} from '@/types/habitTableData'
import { midnightTimestamp } from '@/utils/DateHandler'
import { Timestamp } from 'firebase/firestore'

export const LoadedInitialHabitData = (habitData: HabitTableData): Omit<HabitTableData, 'id'> => ({
  task: habitData.task,
  targetValue: habitData.targetValue,
  targetUnit: habitData.targetUnit,
  frequency: habitData.frequency,
  startDate: habitData.startDate,
  daysKept: habitData.daysKept,
  isActive: habitData.isActive,
  lastNotification: habitData.lastNotification,
  longestStreak: habitData.longestStreak,
  totalCompletions: habitData.totalCompletions,
  createdAt: habitData.createdAt,
  updatedAt: habitData.updatedAt,
  userId: habitData.userId,
  notificationPreferences: habitData.notificationPreferences,
  processLog: habitData.processLog,
  completionLog: habitData.completionLog,
  streak: habitData.streak,
  notes: habitData.notes,
  reminderTime: habitData.reminderTime,
  endDate: habitData.endDate
})

export const emptyHabitData = (): Omit<HabitTableData, 'id'> => ({
  task: '',
  targetValue: 0,
  targetUnit: Unit.Pages, // Default to "page(s)"
  frequency: Frequency.Daily, // Default to "day"
  startDate: midnightTimestamp().toMillis(), // Current time in milliseconds
  daysKept: 0,
  isActive: true, // Default to active habit
  lastNotification: 0, // Default no notifications sent
  longestStreak: 0,
  totalCompletions: 0,
  createdAt: Timestamp.now(), // Set current timestamp
  updatedAt: Timestamp.now(),
  userId: '',
  notificationPreferences: {} as any, // Default value, assuming this is populated later
  processLog: {} as any, // Default value, assuming this is populated later
  completionLog: {} as any, // Default
  streak: 0, // Default streak
  notes: '',
  reminderTime: '',
  endDate: 0
})

export const defaultHabitData = (userId: string): Omit<HabitTableData, 'id'> => ({
  task: '',
  targetValue: 0,
  targetUnit: Unit.Pages, // Default to "page(s)"
  frequency: Frequency.Daily, // Default to "day"
  startDate: midnightTimestamp().toMillis(), // Current time in milliseconds
  daysKept: 0,
  isActive: true, // Default to active habit
  lastNotification: 0, // Default no notifications sent
  longestStreak: 0,
  totalCompletions: 0,
  createdAt: Timestamp.now(), // Set current timestamp
  updatedAt: Timestamp.now(),
  userId,
  notificationPreferences: {} as any, // Default value, assuming this is populated later
  processLog: {} as any, // Default value, assuming this is populated later
  completionLog: {} as any, // Default value, assuming this is populated later
  streak: 0, // Default streak
  notes: '',
  reminderTime: '',
  endDate: 0
})

export const defaultNotificationPreference = (): NotificationPreference => ({
  emailEnabled: false,
  pushEnabled: false,
  smsEnabled: false
})

export const defaultProcessLog = (): ProcessLog => ({
  Date: new Date(),
  Value: 0,
  notes: ''
})
