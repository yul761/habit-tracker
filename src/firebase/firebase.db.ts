import { db } from '@/firebase/firebase.base'
import { collection, addDoc, getDocs, getDoc, doc, setDoc } from 'firebase/firestore'
import { type User } from '@/types/user'

export async function addUser(userId: string, user: User) {
  try {
    const userRef = doc(db, 'user', userId)
    await setDoc(userRef, {
      displayName: user.displayName,
      email: user.email,
      notifyThroughEmail: user.notifyThroughEmail,
      phoneNumber: user.phoneNumber,
      notifyThroughSms: user.notifyThroughSms
    })
    console.log('Document written with ID: ', userId)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export async function getUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, 'user'))
    querySnapshot.forEach((doc) => {
      console.log(doc.data())
    })
  } catch (e) {
    console.error('Error getting documents: ', e)
  }
}

export async function getUserById(userId: string) {
  try {
    const userDoc = await getDoc(doc(db, 'user', userId))
    if (userDoc.exists()) {
      console.log('User data:', userDoc.data())
      return userDoc.data() as User
    } else {
      console.log('No such document!')
      return null
    }
  } catch (e) {
    console.error('Error getting document:', e)
    return null
  }
}

export async function userExists(userId: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, 'user', userId))
    console.log(userDoc)
    console.log(userId)
    console.log(userDoc.exists())
    return userDoc.exists()
  } catch (e) {
    console.error('Error checking if user exists: ', e)
    return false
  }
}
