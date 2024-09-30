export enum Frequency {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly'
}

export enum Unit {
  Pages = 'pages',
  Minutes = 'minutes',
  Hours = 'hours',
  Reps = 'reps',
  Km = 'km',
  Miles = 'miles'
}

export type HabitTableData = {
  id: string
  task: string
  targetValue: number // e.g., 5
  targetUnit: Unit // e.g., "pages", "minutes"
  frequency: Frequency // e.g., "daily", "weekly", "monthly"
  startDate: Date // When the habit starts
  endDate?: Date // Optional end date for the habit
  reminderTime?: string // Optional reminder time in HH:mm format
  notes?: string // Optional notes about the habit
  daysKept: number // Number of days the habit has been kept
}
