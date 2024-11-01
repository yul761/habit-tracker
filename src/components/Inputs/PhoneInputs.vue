// PhoneInput.vue
<template>
  <div>
    <label class="text-subtitle-2 mb-1">{{ label }}</label>
    <v-row no-gutters>
      <v-col cols="4" sm="3">
        <v-select
          v-model="selectedCountry"
          :items="countries"
          item-title="name"
          item-value="code"
          return-object
          :rules="countryRules"
          variant="outlined"
          density="comfortable"
          class="pr-2"
          :disabled="disabled"
          :menu-props="{ maxHeight: 400 }"
        >
          <!-- Country Selection Display -->
          <template v-slot:selection="{ item }">
            <div class="d-flex align-center">
              <span class="mr-2" v-html="getCountryFlag(item.raw.code)"></span>
              <span>{{ item.raw.code }}</span>
            </div>
          </template>

          <!-- Country List Items -->
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props">
              <template v-slot:prepend>
                <span class="mr-2" v-html="getCountryFlag(item.raw.code)"></span>
              </template>
              <v-list-item-title> {{ item.raw.name }} ({{ item.raw.code }}) </v-list-item-title>
            </v-list-item>
          </template>
        </v-select>
      </v-col>

      <v-col>
        <v-text-field
          v-model="phoneNumber"
          :rules="phoneRules"
          :placeholder="phoneNumberPlaceHolder"
          :disabled="disabled"
          :required="required"
          variant="outlined"
          density="comfortable"
          :counter="showCounter"
          @input="handleInput"
          autocomplete="tel"
        >
          <template v-slot:prepend-inner>
            <span class="text-subtitle-2">{{
              selectedCountry ? selectedCountry.dialCode : ''
            }}</span>
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <v-fade-transition>
      <div v-if="errorMessage" class="text-error text-caption mt-1">
        {{ errorMessage }}
      </div>
    </v-fade-transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { PropType } from 'vue'
import {
  parsePhoneNumber,
  getCountries,
  type CountryCode,
  AsYouType,
  getExampleNumber
} from 'libphonenumber-js'
import { getCountryCallingCode } from 'libphonenumber-js/max'
import examples from 'libphonenumber-js/mobile/examples'
import * as countryFlagIcons from 'country-flag-icons/unicode'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'

interface Country {
  code: CountryCode
  dialCode: string
  name: string
}

interface PhoneData {
  countryCode: string
  nationalNumber: string
  fullNumber: string
  isValid: boolean
}

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Phone Number'
  },
  placeholder: {
    type: String,
    default: 'Enter phone number'
  },
  required: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showCounter: {
    type: Boolean,
    default: true
  },
  defaultCountry: {
    type: String as PropType<CountryCode>,
    default: 'US'
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'phone-data', data: PhoneData): void
  (e: 'validation', isValid: boolean): void
}>()

// Get country list from libphonenumber-js
const countries = ref<Country[]>([])
const selectedCountry = ref<Country | null>(null)
const phoneNumber = ref('')
const errorMessage = ref('')
const phoneNumberPlaceHolder = ref(props.placeholder)

// Initialize countries list
onMounted(async () => {
  const countryList = getCountries()
  countries.value = countryList
    .map((code) => ({
      code,
      dialCode: `+${getCountryCallingCode(code)}`,
      name: new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  // Set default country
  selectedCountry.value =
    countries.value.find((c) => c.code === props.defaultCountry) || countries.value[0]
})

// Get country flag from country-flag-icons
const getCountryFlag = (countryCode: string) => {
  return getUnicodeFlagIcon(countryCode) || '🏳️'
}

// Validation rules
const countryRules = [(v: Country) => !!v || 'Country code is required']

const phoneRules = [
  (v: string) => !props.required || !!v || 'Phone number is required',
  (v: string) => {
    if (!v || !selectedCountry.value) return true
    try {
      const phoneNumber = parsePhoneNumber(v, selectedCountry.value.code)
      return phoneNumber.isValid() || 'Invalid phone number format'
    } catch {
      return 'Invalid phone number format'
    }
  }
]

// Format phone number as user types
const handleInput = () => {
  if (!selectedCountry.value) return

  // Format number as user types
  const formatter = new AsYouType(selectedCountry.value.code)
  const formattedNumber = formatter.input(phoneNumber.value)
  phoneNumber.value = formattedNumber

  try {
    const parsedNumber = parsePhoneNumber(phoneNumber.value, selectedCountry.value.code)

    const phoneData: PhoneData = {
      countryCode: selectedCountry.value.code,
      nationalNumber: parsedNumber.nationalNumber || '',
      fullNumber: parsedNumber.number || '',
      isValid: parsedNumber.isValid()
    }

    emit('update:modelValue', phoneData.fullNumber)
    emit('phone-data', phoneData)
    emit('validation', phoneData.isValid)
  } catch (error) {
    console.error('Phone parsing error:', error)
  }
}

// Get example number for placeholder
watch(selectedCountry, (country) => {
  if (country) {
    const example = getExampleNumber(country.code, examples)
    if (example) {
      phoneNumberPlaceHolder.value = example.formatNational()
    }
  }
})

// Watch for external value changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && newValue !== phoneNumber.value) {
      try {
        const parsedNumber = parsePhoneNumber(newValue)
        if (parsedNumber) {
          const country = countries.value.find((c) => c.code === parsedNumber.country)
          if (country) {
            selectedCountry.value = country
            phoneNumber.value = parsedNumber.formatNational()
          }
        }
      } catch (error) {
        console.error('Phone parsing error:', error)
      }
    }
  }
)
</script>

<style scoped>
.v-row {
  margin: 0 -8px;
}
.v-col {
  padding: 0 8px;
}
</style>
