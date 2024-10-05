import type { TableData } from '@/types/tableData'

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
}
