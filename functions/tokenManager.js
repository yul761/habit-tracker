// functions/src/utils/tokenManager.js
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const TOKEN_SECRET = process.env.TOKEN_SECRET

exports.generateHabitCompletionToken = (userId, habitId) => {
  if (!TOKEN_SECRET) {
    throw new Error('TOKEN_SECRET not configured')
  }

  const payload = {
    userId,
    habitId,
    timestamp: Date.now(),
    nonce: crypto.randomBytes(8).toString('hex')
  }

  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: '24h' })
}

exports.verifyToken = (token) => {
  if (!TOKEN_SECRET) {
    throw new Error('TOKEN_SECRET not configured')
  }

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET)

    // Verify required fields exist
    if (!decoded.userId || !decoded.habitId) {
      console.error('Missing required fields in token')
      return null
    }

    return decoded
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}
