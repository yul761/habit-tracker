<template>
  <div class="d-flex align-items-center">
    <TextDropdown :items="dropdownItems" @select="handleSelect" class="me-2">
      <template #selected>
        <span class="mb-0 me-2">Welcome, {{ displayName }}</span>
      </template>
    </TextDropdown>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed, ref } from 'vue'
import TextDropdown from '@/components/Dropdown/TextDropdown.vue'
import { DropdownItems } from '@/enums/UserProfileEnums'
import router from '@/router'

const authStore = useAuthStore()

const user = computed(() => authStore.user)

const displayName = computed(() => {
  if (user.value?.displayName) {
    return user.value.displayName
  } else if (user.value?.email) {
    return user.value.email.split('@')[0]
  }
  return 'User'
})

const signOutUser = () => authStore.signOutUser()

const dropdownItems = ref(Object.values(DropdownItems))

const handleSelect = (item: string) => {
  switch (item) {
    case DropdownItems.Profile:
      router.push('/profile')
      break
    case DropdownItems.SignOut:
      signOutUser()
      router.push('/welcome')
      break
    default:
      console.log('Unknown item selected:', item)
  }
}

const actionForItem1 = () => {
  console.log('Action for Item 1')
  // Add your specific action for Item 1 here
}

const actionForItem2 = () => {
  console.log('Action for Item 2')
  // Add your specific action for Item 2 here
}

const actionForItem3 = () => {
  console.log('Action for Item 3')
  // Add your specific action for Item 3 here
}
</script>
