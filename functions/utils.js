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

module.exports = {
  isDueToday,
  isCompletedToday
}
