import { db } from '@/firebase/firebase.base'
import {
  Frequency,
  Unit,
  type HabitTableData,
  type NotificationPreference,
  type ProcessLog
} from '@/types/habitTableData'
import {
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  collection,
  doc,
  Timestamp,
  addDoc,
  arrayUnion
} from 'firebase/firestore'

export const emptyHabitData = (): Omit<HabitTableData, 'id'> => ({
  task: '',
  targetValue: 0,
  targetUnit: Unit.Pages, // Default to "page(s)"
  frequency: Frequency.Daily, // Default to "day"
  startDate: Timestamp.now().toMillis(), // Current time in milliseconds
  daysKept: 0,
  isActive: true, // Default to active habit
  lastNotification: 0, // Default no notifications sent
  longestStreak: 0,
  totalCompletions: 0,
  createdAt: Timestamp.now(), // Set current timestamp
  updatedAt: Timestamp.now(),
  userId: '',
  notificationPreferences: {} as any, // Default value, assuming this is populated later
  processLog: {} as any, // Default value, assuming this is populated later
  streak: 0, // Default streak
  notes: '',
  reminderTime: '',
  endDate: 0
})

export const defaultHabitData = (userId: string): Omit<HabitTableData, 'id'> => ({
  task: '',
  targetValue: 0,
  targetUnit: Unit.Pages, // Default to "page(s)"
  frequency: Frequency.Daily, // Default to "day"
  startDate: Timestamp.now().toMillis(), // Current time in milliseconds
  daysKept: 0,
  isActive: true, // Default to active habit
  lastNotification: 0, // Default no notifications sent
  longestStreak: 0,
  totalCompletions: 0,
  createdAt: Timestamp.now(), // Set current timestamp
  updatedAt: Timestamp.now(),
  userId,
  notificationPreferences: {} as any, // Default value, assuming this is populated later
  processLog: {} as any, // Default value, assuming this is populated later
  streak: 0, // Default streak
  notes: '',
  reminderTime: '',
  endDate: 0
})

const defaultNotificationPreference = (): NotificationPreference => ({
  emailEnabled: false,
  pushEnabled: false,
  smsEnabled: false
})

const defaultProcessLog = (): ProcessLog => ({
  Date: new Date(),
  Value: 0,
  notes: ''
})

export async function getUserHabits(userId: string) {
  try {
    const habitsRef = collection(db, 'user', userId, 'habits')
    const q = query(habitsRef, where('isActive', '==', true))
    const querySnapshot = await getDocs(q)

    const habits: HabitTableData[] = []
    querySnapshot.forEach((doc) => {
      const habitData = doc.data() as HabitTableData
      habits.push({ ...habitData })
    })

    return habits
  } catch (error) {
    console.error('Error getting user habits:', error)
    return []
  }
}

export async function getHabit(userId: string, habitId: string) {
  try {
    const habitRef = doc(db, 'user', userId, 'habits', habitId)
    const habitSnap = await getDoc(habitRef)
    if (habitSnap.exists()) {
      return { id: habitSnap.id, ...habitSnap.data() }
    } else {
      console.log('No such habit!')
      return null
    }
  } catch (error) {
    console.error('Error getting habit:', error)
  }
}

export async function getNotificationPreference(userId: string, habitId: string) {
  try {
    const habitRef = doc(db, 'user', userId, 'habits', habitId)
    const habitSnap = await getDoc(habitRef)
    if (habitSnap.exists()) {
      const habitData = habitSnap.data()
      const notificationPref = await getDoc(habitData.notificationPreferences)
      const notificationData = notificationPref.data() as NotificationPreference
      return { ...notificationData, id: notificationPref.id }
    } else {
      console.log('No such habit!')
      return null
    }
  } catch (error) {
    console.error('Error getting habit:', error)
  }
}

export async function getProcessLog(userId: string, habitId: string) {
  try {
    const habitRef = doc(db, 'user', userId, 'habits', habitId)
    const habitSnap = await getDoc(habitRef)
    if (habitSnap.exists()) {
      const habitData = habitSnap.data()
      const processLog = await getDoc(habitData.processLog)
      const processLogData = processLog.data() as ProcessLog
      return { ...processLogData, id: processLog.id }
    } else {
      console.log('No such habit!')
      return null
    }
  } catch (error) {
    console.error('Error getting habit:', error)
  }
}

export async function createHabit(userId: string, habitData: HabitTableData) {
  try {
    // Step 1: Create the new habit with default values for notificationPreferences and processLog
    const habitsRef = collection(db, 'user', userId, 'habits')
    const completeHabitData: HabitTableData = {
      ...habitData
    }
    const habitDocRef = await addDoc(habitsRef, completeHabitData) // Automatically generate document ID
    console.log('Habit created with ID:', habitDocRef.id)

    // Step 2: Create the notificationPreference document
    const notificationPrefRef = await addDoc(
      collection(db, 'user', userId, 'habits', habitDocRef.id, 'notificationPreferences'),
      defaultNotificationPreference()
    )
    console.log('Notification preference created with ID:', notificationPrefRef.id)

    // Step 3: Create the processLog document
    const processLogRef = await addDoc(
      collection(db, 'user', userId, 'habits', habitDocRef.id, 'processLog'),
      defaultProcessLog()
    )
    console.log('Process log created with ID:', processLogRef.id)

    // Step 4: Update the habit with references to notificationPreference and processLog
    await updateDoc(habitDocRef, {
      notificationPreferences: notificationPrefRef,
      processLog: processLogRef
    })
    console.log('Habit updated with notificationPreferences and processLog references.')

    // Step 5: Get the reference of the newly created habit
    const habitReference = doc(db, 'user', userId, 'habits', habitDocRef.id)

    // Step 6: Update the user's profile to add the habit reference to the "habits" array
    const userRef = doc(db, 'user', userId) // Reference to the user document
    await updateDoc(userRef, {
      habits: arrayUnion(habitReference) // Add the new habit reference to the "habits" array
    })

    console.log('User profile updated with new habit reference.')
    return habitDocRef.id
  } catch (error) {
    console.error('Error creating habit or updating user profile:', error)
    return null
  }
}
