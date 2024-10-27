// functions/index.js

const { onSchedule } = require('firebase-functions/v2/scheduler')
const { onRequest, onCall } = require('firebase-functions/v2/https')
const { defineString } = require('firebase-functions/params')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const nodemailer = require('nodemailer')
const twilio = require('twilio')

// Initialize Firebase Admin
initializeApp()

// Load environment variables based on environment
let emailConfig, twilioConfig

if (process.env.NODE_ENV === 'production') {
  // Production: use Firebase config
  emailConfig = {
    user: process.env.FIREBASE_CONFIG_EMAIL_USER,
    password: process.env.FIREBASE_CONFIG_EMAIL_PASSWORD
  }
  twilioConfig = {
    accountSid: process.env.FIREBASE_CONFIG_TWILIO_ACCOUNT_SID,
    authToken: process.env.FIREBASE_CONFIG_TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.FIREBASE_CONFIG_TWILIO_PHONE_NUMBER
  }
} else {
  // Development: use .env file
  require('dotenv').config()
  emailConfig = {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_APP_PASSWORD
  }
  twilioConfig = {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  }
}

// Email configuration
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailConfig.user,
    pass: emailConfig.password
  }
})

// Twilio configuration
const twilioClient = twilio(twilioConfig.accountSid, twilioConfig.authToken)

async function sendNotifications(notificationType) {
  const db = getFirestore()

  try {
    const usersSnapshot = await db
      .collection('users')
      .where('notifications.enabled', '==', true)
      .get()

    const notifications = []

    for (const doc of usersSnapshot.docs) {
      const user = doc.data()
      const message = user.notifications.message

      if (user.email) {
        notifications.push(
          emailTransporter.sendMail({
            from: emailUser,
            to: user.email,
            subject: `${notificationType} Notification`,
            text: message
          })
        )
      }

      if (user.phone) {
        notifications.push(
          twilioClient.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: user.phone
          })
        )
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
    retryCount: 3,
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
    retryCount: 3,
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
    retryCount: 3,
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
