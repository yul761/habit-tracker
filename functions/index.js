// Load environment variables from .env file for local development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const { onSchedule } = require('firebase-functions/v2/scheduler')
const { onRequest, onCall } = require('firebase-functions/v2/https')
const { defineString } = require('firebase-functions/params')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const admin = require('firebase-admin')
const nodemailer = require('nodemailer')
const twilio = require('twilio')
const quotes = require('success-motivational-quotes')
const {
  isDueToday,
  isCompletedToday,
  getCompletionPercentage,
  getLastSevenDaysCompletion
} = require('./utils')
const templateManager = require('./emailTemplateManager')
const { getLogoUrl } = require('./firebase.storage')

// Define environment parameters for production
const emailUser = defineString('EMAIL_USER')
const emailPassword = defineString('EMAIL_APP_PASSWORD')
const twilioAccountSid = defineString('TWILIO_ACCOUNT_SID')
const twilioAuthToken = defineString('TWILIO_AUTH_TOKEN')
const twilioPhoneNumber = defineString('TWILIO_PHONE_NUMBER')
const storageBucket = defineString('STORAGE_BUCKET')

// Determine environment variables based on environment
const EMAIL_USER = process.env.EMAIL_USER || emailUser.value()
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD || emailPassword.value()
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || twilioAccountSid.value()
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || twilioAuthToken.value()
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || twilioPhoneNumber.value()
const STORAGE_BUCKET = process.env.STORAGE_BUCKET || storageBucket.value()

// For local development
if (process.env.NODE_ENV !== 'production') {
  const serviceAccount = require('./serviceAccountKey.json')
  initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: STORAGE_BUCKET
  })
} else {
  const serviceAccountParams = {
    type: process.env.SERVICE_ACCOUNT_TYPE,
    project_id: process.env.SERVICE_ACCOUNT_PROJECT_ID,
    private_key_id: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
    client_email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
    client_id: process.env.SERVICE_ACCOUNT_CLIENT_ID,
    auth_uri: process.env.SERVICE_ACCOUNT_AUTH_URI,
    token_uri: process.env.SERVICE_ACCOUNT_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.SERVICE_ACCOUNT_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.SERVICE_ACCOUNT_CLIENT_CERT_URL,
    universe_domain: process.env.SERVICE_ACCOUNT_UNIVERSE_DOMAIN
  }
  // For production, uses environment credentials
  initializeApp({
    credential: admin.credential.cert(serviceAccountParams),
    storageBucket: STORAGE_BUCKET
  })
}

// Email configuration
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_APP_PASSWORD
  }
})

// Twilio configuration
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

/**
 * @param {string} notificationType
 */
async function sendNotifications(notificationType) {
  console.log(`Starting ${notificationType} notifications`)

  if (!EMAIL_USER || !EMAIL_APP_PASSWORD) {
    throw new Error('Email configuration missing')
  }

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new Error('Twilio configuration missing')
  }

  const db = getFirestore()

  try {
    // Query for users who want to be notified through email
    const emailUsersSnapshot = await db
      .collection('user')
      .where('notifyThroughEmail', '==', true)
      .get()

    // Query for users who want to be notified through SMS
    const smsUsersSnapshot = await db.collection('user').where('notifyThroughSms', '==', true).get()

    // Merge the results
    const users = new Map()
    emailUsersSnapshot.forEach((doc) => users.set(doc.id, doc.data()))
    smsUsersSnapshot.forEach((doc) => {
      if (!users.has(doc.id)) {
        users.set(doc.id, doc.data())
      }
    })

    const notifications = []
    for (const user of users.values()) {
      // if user.habits is an array with document reference, get the actual data of habits
      const habits = await Promise.all(
        user.habits.map(async (habitRef) => {
          const doc = await habitRef.get()
          const habitData = doc.data()

          // Get the completeLogs data if completionLog is not null
          if (Array.isArray(habitData.completionLog) && habitData.completionLog.length > 0) {
            habitData.completionLog = await Promise.all(
              habitData.completionLog.map(async (logRef) => {
                const logDoc = await logRef.get()
                return logDoc.data()
              })
            )
          }

          return habitData
        })
      )

      const dueHabits = habits.filter((habit) => {
        if (!Array.isArray(habit.completionLog) || habit.completionLog.length === 0) {
          return isDueToday(habit)
        }
        return isDueToday(habit) && !isCompletedToday(habit.completionLog)
      })

      for (const habit of dueHabits) {
        const message = habit.task

        if (user.notifyThroughEmail && user.email) {
          // const brandingLogo = await getLogoUrl('favcon-no-background.png')
          let brandingLogo
          try {
            brandingLogo = await getLogoUrl('favcon-no-background.png')
          } catch (error) {
            console.warn('Failed to get logo URL, continuing without logo')
            brandingLogo = null
          }
          const userName = user.displayName || user.email.split('@')[0]
          const todayQuote = quotes.getTodaysQuote()
          const templateData = {
            // Time-based greeting
            timeOfDay: notificationType, // 'Morning' or "Evening", "Afternoon"

            // User info
            userName: userName,

            // Progress metrics
            streak: habit.streak,

            // Statistics
            completionRate: getCompletionPercentage(habit),
            daysCompleted: habit.completionLog?.length || 0,
            bestStreak: habit.longestStreak,

            // Habit details
            habitName: habit.task,
            lastSevenDays: getLastSevenDaysCompletion(habit.completionLog),

            // Motivational content
            motivationalQuote: todayQuote.body,
            quoteAuthor: todayQuote.by,

            // Action URLs
            actionUrl: 'https://habithub.com/habits/123/complete',
            statsUrl: 'https://habithub.com/habits/123/stats',

            // Social sharing
            twitterShareUrl: 'https://twitter.com/intent/tweet?text=...',
            facebookShareUrl: 'https://facebook.com/sharer/sharer.php?...',
            linkedinShareUrl: 'https://www.linkedin.com/sharing/...',

            // Branding
            logoUrl: brandingLogo
          }

          const emailHtml = templateManager.render('reminder', templateData)

          notifications.push(
            emailTransporter.sendMail({
              from: EMAIL_USER,
              to: user.email,
              subject: `${notificationType} Habit Reminder: ${habit.task}`,
              html: emailHtml,
              text: `Time to complete your habit: ${habit.task}`
            })
          )
        }

        if (user.notifyThroughSms && user.phoneNumber) {
          notifications.push(
            twilioClient.messages.create({
              body: message,
              from: TWILIO_PHONE_NUMBER,
              to: user.phoneNumber
            })
          )
        }
      }
    }

    await Promise.all(notifications)
    console.log(`Successfully sent ${notificationType} notifications`)
    return { success: true, count: notifications.length }
  } catch (error) {
    console.error('Error sending notifications:', error)
    throw error
  }
}

// Scheduled functions
exports.morningNotification = onSchedule(
  {
    schedule: '0 9 * * *',
    timeZone: 'UTC',
    maxInstances: 1,
    retryConfig: {
      retryCount: 4
    },
    labels: {
      type: 'notification',
      time: 'morning'
    }
  },
  async (event) => {
    try {
      // Add detailed logging
      console.log('Starting Morning notification process')
      console.log('Environment check:', {
        hasEmailConfig: !!EMAIL_USER && !!EMAIL_APP_PASSWORD,
        hasTwilioConfig: !!TWILIO_ACCOUNT_SID && !!TWILIO_AUTH_TOKEN,
        hasStorageConfig: !!STORAGE_BUCKET
      })

      const result = await sendNotifications('Morning')
      console.log('Morning notification completed successfully:', result)
      return result
    } catch (error) {
      console.error('Morning notification failed:', error)
      // Re-throw to trigger retry
      throw error
    }
  }
)

exports.afternoonNotification = onSchedule(
  {
    schedule: '0 13 * * *',
    timeZone: 'UTC',
    maxInstances: 1,
    retryConfig: {
      retryCount: 4
    },
    labels: {
      type: 'notification',
      time: 'afternoon'
    }
  },
  async (event) => {
    try {
      // Add detailed logging
      console.log('Starting afternoon notification process')
      console.log('Environment check:', {
        hasEmailConfig: !!EMAIL_USER && !!EMAIL_APP_PASSWORD,
        hasTwilioConfig: !!TWILIO_ACCOUNT_SID && !!TWILIO_AUTH_TOKEN,
        hasStorageConfig: !!STORAGE_BUCKET
      })

      const result = await sendNotifications('Afternoon')
      console.log('Afternoon notification completed successfully:', result)
      return result
    } catch (error) {
      console.error('Afternoon notification failed:', error)
      // Re-throw to trigger retry
      throw error
    }
  }
)

exports.eveningNotification = onSchedule(
  {
    schedule: '0 18 * * *',
    timeZone: 'UTC',
    maxInstances: 1,
    retryConfig: {
      retryCount: 4
    },
    labels: {
      type: 'notification',
      time: 'evening'
    }
  },
  async (event) => {
    try {
      // Add detailed logging
      console.log('Starting evening notification process')
      console.log('Environment check:', {
        hasEmailConfig: !!EMAIL_USER && !!EMAIL_APP_PASSWORD,
        hasTwilioConfig: !!TWILIO_ACCOUNT_SID && !!TWILIO_AUTH_TOKEN,
        hasStorageConfig: !!STORAGE_BUCKET
      })

      const result = await sendNotifications('Evening')
      console.log('Evening notification completed successfully:', result)
      return result
    } catch (error) {
      console.error('Evening notification failed:', error)
      // Re-throw to trigger retry
      throw error
    }
  }
)

// HTTP endpoint for manual triggers
exports.triggerNotification = onRequest(
  {
    cors: true,
    maxInstances: 10
  },
  async (req, res) => {
    try {
      const type = req.query.type || 'all'
      const result = await sendNotifications(`Manual - ${type}`)
      res.json(result)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
)

// Callable function for Vue frontend
exports.triggerNotificationFromClient = onCall(
  {
    maxInstances: 10,
    timeoutSeconds: 120
  },
  async (request) => {
    try {
      const type = request.data.type || 'all'
      return await sendNotifications(`Manual - ${type}`)
    } catch (error) {
      throw new Error(error.message)
    }
  }
)
