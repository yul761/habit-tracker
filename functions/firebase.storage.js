const { getStorage } = require('firebase-admin/storage')

/**
 * Get the URL for the logo image stored in Firebase Storage.
 * @param {*} logoName
 * @returns
 */
async function getLogoUrl(logoName) {
  const storage = getStorage()
  const bucket = storage.bucket()
  const file = bucket.file(logoName)

  try {
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000 // 1 hour from now
    })

    return signedUrl
  } catch (error) {
    console.error('Error getting logo URL:', error)
    throw error
  }
}

module.exports = {
  getLogoUrl
}
