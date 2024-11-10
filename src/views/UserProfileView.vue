<template>
  <div class="user-profile-container">
    <div class="user-profile">
      <h1>User Profile</h1>
      <form @submit.prevent="updateProfile">
        <div class="form-group mb-3">
          <label for="displayName" class="form-label">Display Name</label>
          <input type="text" id="displayName" v-model="displayName" class="form-control" required />
        </div>
        <div class="form-group mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" id="email" v-model="email" class="form-control" required />
          <div class="form-check">
            <input
              type="checkbox"
              id="emailUpdates"
              v-model="emailUpdates"
              class="form-check-input"
            />
            <label for="emailUpdates" class="form-check-label"
              >Receive updates through email?</label
            >
          </div>
        </div>
        <div class="form-group mb-3">
          <PhoneInputs
            v-model="phoneNumber"
            v-model:isValid="isPhoneNumberValid"
            @phone-data="handlePhoneData"
            required
          />
          <div class="form-check">
            <input type="checkbox" id="smsUpdates" v-model="smsUpdates" class="form-check-input" />
            <label for="smsUpdates" class="form-check-label">Receive updates through SMS?</label>
          </div>
        </div>
        <button
          type="submit"
          class="btn btn-primary w-100 d-flex justify-content-center align-items-center"
          :disabled="disableUpdateProfileBtn"
        >
          <span class="updateProfile">Update Profile</span>
          <span class="indicator-container ms-2">
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span v-if="success" class="fw-bold">&#10003;</span>
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getUserById, updateUser } from '@/firebase/firebase.user.db'
import PhoneInputs from '@/components/Inputs/PhoneInputs.vue'

const authStore = useAuthStore()
const loading = ref(false)
const success = ref(false)

const displayName = ref('')
const email = ref('')
const phoneNumber = ref('')
const emailUpdates = ref(false)
const smsUpdates = ref(false)
const isPhoneNumberValid = ref(true)

const initialData = reactive({
  displayName: '',
  email: '',
  phoneNumber: '',
  emailUpdates: false,
  smsUpdates: false
})

const loadUserData = async () => {
  if (authStore.user) {
    const user = await getUserById(authStore.user.uid)
    if (user) {
      displayName.value = user.displayName ?? ''
      email.value = user.email ?? ''
      phoneNumber.value = user.phoneNumber
      emailUpdates.value = user.notifyThroughEmail
      smsUpdates.value = user.notifyThroughSms

      // Store initial values
      initialData.displayName = displayName.value
      initialData.email = email.value
      initialData.phoneNumber = phoneNumber.value
      initialData.emailUpdates = emailUpdates.value
      initialData.smsUpdates = smsUpdates.value
    }
  }
}

const checkUserData = () => {
  if (authStore.user) {
    loadUserData()
  } else {
    setTimeout(checkUserData, 1000) // Check every second until user data is available
  }
}

const handlePhoneData = (data: {
  countryCode: string
  nationalNumber: string
  fullNumber: string
  isValid: boolean
}) => {
  console.log('Phone data:', data)
}

onMounted(() => {
  console.log('User Profile View mounted')
  checkUserData()
})

const isFormModified = computed(() => {
  return (
    displayName.value !== initialData.displayName ||
    email.value !== initialData.email ||
    phoneNumber.value !== initialData.phoneNumber ||
    emailUpdates.value !== initialData.emailUpdates ||
    smsUpdates.value !== initialData.smsUpdates
  )
})

const disableUpdateProfileBtn = computed(() => {
  return !isFormModified.value || !isPhoneNumberValid.value
})

const updateProfile = () => {
  loading.value = true
  success.value = false
  // Handle profile update logic here
  console.log('Profile updated:', {
    displayName: displayName.value,
    email: email.value,
    phoneNumber: phoneNumber.value,
    emailUpdates: emailUpdates.value,
    smsUpdates: smsUpdates.value
  })

  // Update the user profile in the database
  if (authStore.user) {
    updateUser(authStore.user.uid, {
      displayName: displayName.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      notifyThroughEmail: emailUpdates.value,
      notifyThroughSms: smsUpdates.value
    })
      .then(() => {
        console.log('User profile updated successfully')
        initialData.displayName = displayName.value
        initialData.email = email.value
        initialData.phoneNumber = phoneNumber.value
        initialData.emailUpdates = emailUpdates.value
        initialData.smsUpdates = smsUpdates.value
        success.value = true
        setTimeout(() => {
          success.value = false
        }, 1000)
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    loading.value = false
  }
}
</script>

<style scoped>
.user-profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  grid-column: span 2;
  min-width: 400px;
}

.user-profile {
  max-width: 400px;
  width: 100%;
}

.user-profile h1 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-check {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.form-check-input {
  margin-right: 0.5rem;
  width: 20px !important; /* Adjust the width */
  height: 20px !important; /* Adjust the height */
}

.form-check-label {
  display: inline-block;
}

.indicator-container {
  display: inline-block;
  width: 1.5rem; /* Adjust width as needed */
  height: 1.5rem; /* Adjust height as needed */
  vertical-align: middle;
}

.spinner-border {
  width: 1rem;
  height: 1rem;
  border-width: 0.2em;
}

.updateProfile {
  margin-left: 1.5rem;
  color: white;
}
</style>
