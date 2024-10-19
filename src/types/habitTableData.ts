import type { TableData } from '@/types/tableData'
import type { DocumentReference, Timestamp } from 'firebase/firestore'

export enum Frequency {
  Daily = 'day',
  Weekly = 'week',
  Monthly = 'month'
}

export enum Unit {
  Pages = 'page(s)',
  Minutes = 'minute(s)',
  Hours = 'hour(s)',
  Reps = 'rep(s)',
  Km = 'km',
  Miles = 'miles'
}
export interface ReminderListData extends HabitTableData {
  isCompleted: boolean
}
export interface HabitTableData extends TableData {
  task: string
  targetValue: number // e.g., 5
  targetUnit: Unit // e.g., "pages", "minutes"
  frequency: Frequency // e.g., "daily", "weekly", "monthly"
  startDate: number // When the habit starts
  endDate?: number // Optional end date for the habit
  reminderTime?: string // Optional reminder time in HH:mm format
  notes?: string // Optional notes about the habit
  daysKept: number // Number of days the habit has been kept

  isActive: boolean // Whether the habit is currently active
  lastNotification: number // Timestamp of the last notification (as a Unix timestamp)
  longestStreak: number // Longest streak of days keeping the habit
  streak: number // Current streak of the habit
  totalCompletions: number // Total number of habit completions
  createdAt: Timestamp // Timestamp of when the habit was created (Firebase Timestamp)
  updatedAt: Timestamp // Timestamp of the last update (Firebase Timestamp)
  userId: string // ID of the user who created the habit
  notificationPreferences: DocumentReference // Reference to user's notification preferences
  processLog: DocumentReference // Reference to the log for processing
  completionLog: DocumentReference // Reference to the log for completions
}

export interface NotificationPreference extends TableData {
  emailEnabled: boolean
  pushEnabled: boolean
  smsEnabled: boolean
}

export interface ProcessLog extends TableData {
  Date: Date
  Value: number
  notes: string
}

export interface CompletionLog extends TableData {
  Date: Timestamp
  notes: string
}
