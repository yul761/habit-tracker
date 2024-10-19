import { updateHabit } from '@/firebase/firebase.habit.db'
import { type CompletionLog, type HabitTableData, Frequency } from '@/types/habitTableData'

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

export const IsCompletedToday = (completeLogs: CompletionLog[]) => {
  const today = new Date()
  return completeLogs.some((log) => {
    const logDate = convertFirestoreTimestampToDate(log.Date)
    return logDate.getDate() === today.getDate()
  })
}

function convertFirestoreTimestampToDate(timestamp: {
  seconds: number
  nanoseconds: number
}): Date {
  return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)
}

export const UpdateStreak = async (data: HabitTableData) => {
  const userId = data.userId
  const habitId = data.id as string
  const streak = data.streak + 1
  const daysKept = data.daysKept + 1
  const longestStreak = data.longestStreak < streak ? streak : data.longestStreak

  await updateHabit(userId, habitId, { streak, longestStreak, daysKept })
}
