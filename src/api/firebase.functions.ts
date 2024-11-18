async function sendWelcomeEmail(email: string, name: string) {
  const functionUrl = 'https://us-central1-habit-tracker-a6b59.cloudfunctions.net/sendWelcomeEmail'

  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, name })
    })

    if (!response.ok) {
      throw new Error('Failed to send welcome email')
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending welcome email:', error)
    throw error
  }
}

async function sendPasswordResetRequest(email: string, token: string) {
  const functionUrl = 'https://us-central1-habit-tracker-a6b59.cloudfunctions.net/sendPasswordReset'

  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, token })
    })

    if (!response.ok) {
      throw new Error('Failed to send password reset email')
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending password reset:', error)
    throw error
  }
}

export { sendWelcomeEmail, sendPasswordResetRequest }
