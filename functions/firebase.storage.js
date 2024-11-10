const { getStorage } = require('firebase-admin/storage')

/**
 * Get a signed URL for a logo stored in Cloud Storage
 * @param {*} logoName
 * @return {string} - The signed URL
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
