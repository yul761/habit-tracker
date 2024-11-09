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
const { isDueToday, isCompletedToday } = require('./utils')
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
  // For production, uses environment credentials
  initializeApp()
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
          const brandingLogo = await getLogoUrl('favcon-no-background.png')
          console.log(brandingLogo)
          const templateData = {
            // Time-based greeting
            timeOfDay: 'Morning', // or "Evening", "Afternoon"

            // User info
            userName: user.displayName ?? user.email.split('@')[0],

            // Progress metrics
            streak: 7,
            streakPercentage: 70,

            // Statistics
            completionRate: 85,
            daysCompleted: 30,
            bestStreak: 14,

            // Habit details
            habitName: habit.task,
            lastSevenDays: [
              { completed: true },
              { completed: true },
              { completed: false },
              { completed: true },
              { completed: true },
              { completed: true },
              { completed: false }
            ],

            // Motivational content
            motivationalQuote:
              'Success is not final, failure is not fatal: it is the courage to continue that counts',
            quoteAuthor: 'Winston Churchill',

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

          // const emailHtml = templateManager.render('reminder', {
          //   userName: user.name || 'there',
          //   habitName: habit.task,
          //   streak: habit.streak || 0,
          //   customMessage:
          //     notificationType === 'Morning'
          //       ? 'Start your day right!'
          //       : notificationType === 'Evening'
          //         ? 'Do not break your streak!'
          //         : 'Keep up the good work!',
          //   actionUrl: `www.habithub.com/habits/${habit.id}/complete`
          // })
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
    timeZone: 'America/New_York',
    maxInstances: 1,
    retryConfig: {
      retryCount: 3
    },
    labels: {
      type: 'notification',
      time: 'morning'
    }
  },
  async (event) => {
    return sendNotifications('Morning')
  }
)

exports.afternoonNotification = onSchedule(
  {
    schedule: '0 13 * * *',
    timeZone: 'America/New_York',
    maxInstances: 1,
    retryConfig: {
      retryCount: 3
    },
    labels: {
      type: 'notification',
      time: 'afternoon'
    }
  },
  async (event) => {
    return sendNotifications('Afternoon')
  }
)

exports.eveningNotification = onSchedule(
  {
    schedule: '0 18 * * *',
    timeZone: 'America/New_York',
    maxInstances: 1,
    retryConfig: {
      retryCount: 3
    },
    labels: {
      type: 'notification',
      time: 'evening'
    }
  },
  async (event) => {
    return sendNotifications('Evening')
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
