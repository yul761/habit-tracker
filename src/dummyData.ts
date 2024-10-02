import { type HabitTableData, Unit, Frequency } from './types/habitTableData'

export const habits: HabitTableData[] = [
  {
    id: '1',
    task: 'Read book',
    targetValue: 5,
    targetUnit: Unit.Pages,
    frequency: Frequency.Daily,
    startDate: new Date('2023-01-01T00:00:00').getTime(),
    endDate: new Date('2025-12-31T00:00:00').getTime(),
    reminderTime: '20:00',
    notes: 'Read before bed',
    daysKept: 10
  },
  {
    id: '2',
    task: 'Run',
    targetValue: 30,
    targetUnit: Unit.Minutes,
    frequency: Frequency.Daily,
    startDate: new Date('2023-01-01T00:00:00').getTime(),
    endDate: new Date('2023-12-31T00:00:00').getTime(),
    reminderTime: '06:00',
    notes: 'Morning run',
    daysKept: 5
  },
  {
    id: '3',
    task: 'Meditate',
    targetValue: 15,
    targetUnit: Unit.Minutes,
    frequency: Frequency.Daily,
    startDate: new Date('2023-01-01T00:00:00').getTime(),
    endDate: new Date('2023-12-31T00:00:00').getTime(),
    reminderTime: '07:00',
    notes: 'Morning meditation',
    daysKept: 7
  },
  {
    id: '4',
    task: 'Write journal',
    targetValue: 1,
    targetUnit: Unit.Pages,
    frequency: Frequency.Daily,
    startDate: new Date('2023-01-01T00:00:00').getTime(),
    endDate: new Date('2023-12-31T00:00:00').getTime(),
    reminderTime: '21:00',
    notes: 'Reflect on the day',
    daysKept: 12
  },
  {
    id: '5',
    task: 'Exercise',
    targetValue: 45,
    targetUnit: Unit.Minutes,
    frequency: Frequency.Weekly,
    startDate: new Date('2023-01-01T00:00:00').getTime(),
    endDate: new Date('2025-12-31T00:00:00').getTime(),
    reminderTime: '18:00',
    notes: 'Evening workout',
    daysKept: 8
  },
  {
    id: '6',
    task: 'Learn coding',
    targetValue: 2,
    targetUnit: Unit.Hours,
    frequency: Frequency.Weekly,
    startDate: new Date('2024-09-25T00:00:00').getTime(),
    endDate: new Date('2025-12-31T00:00:00').getTime(),
    reminderTime: '19:00',
    notes: 'Practice coding skills',
    daysKept: 15
  }
]
