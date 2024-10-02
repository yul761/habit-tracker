import { type HabitTableData, Frequency } from '@/types/habitTableData'

export const IsDueToday = (data: HabitTableData) => {
  const today = new Date()
  switch (data.frequency) {
    case Frequency.Daily:
      return true
    case Frequency.Weekly: {
      const startDate = new Date(data.startDate)
      const diffTime = Math.abs(today.getTime() - startDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      return diffDays % 7 === 0
    }
    case Frequency.Monthly: {
      const startDate = new Date(data.startDate)
      return today.getDate() === startDate.getDate()
    }
    default:
      throw new Error('Invalid frequency')
  }
}
