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
          <label for="phoneNumber" class="form-label">Phone Number</label>
          <input type="tel" id="phoneNumber" v-model="phoneNumber" class="form-control" required />
          <div class="form-check">
            <input type="checkbox" id="smsUpdates" v-model="smsUpdates" class="form-check-input" />
            <label for="smsUpdates" class="form-check-label">Receive updates through SMS?</label>
          </div>
        </div>
        <button type="submit" class="btn btn-primary w-100">Update Profile</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const displayName = ref('')
const email = ref('')
const phoneNumber = ref('')
const emailUpdates = ref(false)
const smsUpdates = ref(false)

const updateProfile = () => {
  // Handle profile update logic here
  console.log('Profile updated:', {
    displayName: displayName.value,
    email: email.value,
    phoneNumber: phoneNumber.value,
    emailUpdates: emailUpdates.value,
    smsUpdates: smsUpdates.value
  })
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
</style>
