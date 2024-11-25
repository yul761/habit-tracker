<template>
  <div class="container">
    <header>
      <h1>Welcome to HabitHub</h1>
      <p class="tagline">Your Personal Habit Tracking Assistant</p>
    </header>

    <main>
      <section>
        <h2>Transform Your Life, One Habit at a Time</h2>
        <p>
          HabitHub is your all-in-one solution for creating, tracking, and maintaining positive
          habits. Whether you're aiming to read more, exercise regularly, or learn a new skill,
          HabitHub is here to support your journey to self-improvement.
        </p>
      </section>

      <section class="features">
        <div v-for="feature in features" :key="feature.title" class="feature">
          <v-icon :icon="feature.icon" size="large" color="#3498db" />
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </section>

      <section>
        <h2>How It Works</h2>
        <ol>
          <li v-for="step in howItWorks" :key="step">{{ step }}</li>
        </ol>
        <button v-if="isAuthenticated" @click="proceedToHabits" class="proceed-button">
          Proceed to Habits
        </button>
      </section>

      <section>
        <h2>See Your Daily Habits at a Glance</h2>
        <p>
          The home page displays all the habits you need to complete today, helping you stay focused
          and motivated.
        </p>
      </section>

      <section>
        <h2>Ready to Transform Your Life?</h2>
        <p>Join thousands of users who are already building better habits with HabitHub.</p>
        <a href="#" class="cta-button" @click.prevent="goToSignUp">Sign Up Now</a>
      </section>
    </main>

    <!-- <footer>
      <p>Have questions? Check out our <a href="#">FAQ</a> or <a href="#">contact us</a>.</p>
    </footer> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Welcome to HabitHub',
  meta: [
    {
      name: 'description',
      content:
        'Start your self-improvement journey with HabitHub. Create, track, and maintain positive habits to transform your life.'
    }
  ]
})

const features = ref([
  {
    icon: 'mdi-checkbox-marked-circle-outline',
    title: 'Create Custom Habits',
    description: 'Set up personalized habits tailored to your goals'
  },
  {
    icon: 'mdi-bell-outline',
    title: 'Daily Reminders',
    description: 'Get notified via email or SMS to stay on track'
  },
  {
    icon: 'mdi-chart-line',
    title: 'Track Your Progress',
    description: 'Monitor your streaks and celebrate your achievements'
  }
])

const howItWorks = ref([
  'Create your user profile',
  'Set up your habits (e.g., read 5 pages per day)',
  'Receive daily notifications',
  'Mark habits as completed',
  'View your progress and streaks'
])

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const router = useRouter()
const proceedToHabits = () => {
  router.push('/')
}
const goToSignUp = () => {
  router.push('/signup')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

body {
  font-family: 'Poppins', sans-serif;
  line-height: 1.6;
  color: #333;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  grid-column: span 2;
  margin-top: 100px;
}

header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 0;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2c3e50;
  font-size: 2.5em;
  margin-bottom: 10px;
}

.tagline {
  font-style: italic;
  color: #7f8c8d;
  font-size: 1.2em;
}

.features {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.feature {
  flex-basis: 30%;
  text-align: center;
  margin-bottom: 20px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature:hover {
  transform: translateY(-5px);
}

.feature i {
  font-size: 2em;
  color: #3498db;
  margin-bottom: 10px;
}

.cta-button {
  display: inline-block;
  background-color: #3498db;
  color: white;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 25px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #2980b9;
}

.screenshot {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

section {
  background: white;
  padding: 30px;
  margin-bottom: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

footer {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
}

@media (max-width: 768px) {
  .feature {
    flex-basis: 100%;
  }
}
.proceed-button {
  display: inline-block;
  background-color: #3498db;
  color: white;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 25px;
  font-weight: bold;
  transition: background-color 0.3s ease;
  margin-top: 20px;
}

.proceed-button:hover {
  background-color: #2980b9;
}
</style>
