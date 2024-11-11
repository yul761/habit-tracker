const Frequency = {
  Daily: 'day',
  Weekly: 'week',
  Monthly: 'month'
}

const isDueToday = (data) => {
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

const isCompletedToday = (completeLogs) => {
  if (!completeLogs) {
    return false
  }

  const today = new Date()
  return completeLogs.some((log) => {
    const logDate = convertFirestoreTimestampToDate(log.Date)
    return logDate.getDate() === today.getDate()
  })
}

/**
 * Converts a Firestore Timestamp to a Date object
 * @param {Object} timestamp - Firestore Timestamp object
 * @return {Date} - Date object
 */
function convertFirestoreTimestampToDate(timestamp) {
  return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)
}

/**
 * Returns a greeting based on the time of day.
 * @param {Object} options - Handlebars options object
 * @return {string} - The greeting
 */
function timeOfDay(options) {
  const hour = new Date().getHours()
  console.log('time of day ', hour)
  const context = {
    isMorning: hour >= 5 && hour < 12,
    isEvening: hour >= 18 || hour < 5,
    text: hour >= 5 && hour < 12 ? 'Morning' : hour >= 18 || hour < 5 ? 'Evening' : 'Afternoon'
  }

  // If used as block helper (for emoji)
  if (options && options.fn) {
    return options.fn(context)
  }

  // If used as regular helper (for text)
  return context.text
}

const getCompletionPercentage = (habit) => {
  if (!Array.isArray(habit.completionLog) || habit.completionLog.length === 0) {
    return 0
  }

  const completedLogs = habit.completionLog

  const startDate = convertFirestoreTimestampToDate(habit.createdAt)

  const frequency = habit.frequency

  const now = new Date()
  const diffTime = Math.abs(now.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  let expectedCompletions
  switch (frequency) {
    case Frequency.Daily:
      expectedCompletions = diffDays
      break
    case Frequency.Weekly:
      expectedCompletions = Math.floor(diffDays / 7)
      break
    case Frequency.Monthly:
      // Calculate months between dates
      expectedCompletions =
        now.getMonth() - startDate.getMonth() + 12 * (now.getFullYear() - startDate.getFullYear())
      break
    default:
      return 0
  }

  const actualCompletions = completedLogs.length
  return Math.round((actualCompletions / expectedCompletions) * 100) || 0
}

/**
 * Get completion status for last 7 days
 * @param {Array} completeLogs - Array of completion logs with Firestore timestamps
 * @return {Array<{completed: boolean}>} Array of completion status objects
 */
const getLastSevenDaysCompletion = (completeLogs) => {
  // Return array of 7 uncompleted days if no logs
  if (!Array.isArray(completeLogs) || completeLogs.length === 0) {
    return new Array(7).fill({ completed: false })
  }

  const result = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    // Count down to maintain oldest->newest order
    const checkDate = new Date(today)
    checkDate.setDate(today.getDate() - i)

    const completed = completeLogs.some((log) => {
      const logDate = convertFirestoreTimestampToDate(log.Date)
      return (
        logDate.getDate() === checkDate.getDate() &&
        logDate.getMonth() === checkDate.getMonth() &&
        logDate.getFullYear() === checkDate.getFullYear()
      )
    })

    result.push({ completed })
  }

  return result
}
module.exports = {
  isDueToday,
  isCompletedToday,
  timeOfDay,
  getCompletionPercentage,
  getLastSevenDaysCompletion
}
