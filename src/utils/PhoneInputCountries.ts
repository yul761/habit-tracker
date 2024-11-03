// src/utils/phoneCountries.ts
import { getCountries, type CountryCode } from 'libphonenumber-js'
import { getCountryCallingCode } from 'libphonenumber-js/max'

interface Country {
  code: CountryCode
  dialCode: string
  name: string
}

// filter out only Major countries list for permance reasons
const MAJOR_COUNTRIES: CountryCode[] = [
  'US', // United States
  'GB', // United Kingdom
  'CA', // Canada
  'AU', // Australia
  'DE', // Germany
  'FR', // France
  'IT', // Italy
  'ES', // Spain
  'JP', // Japan
  'CN', // China
  'IN', // India
  'BR', // Brazil
  'MX', // Mexico
  'RU', // Russia
  'KR', // South Korea
  'SG', // Singapore
  'AE', // UAE
  'SA' // Saudi Arabia
]

export const getFormattedCountries = (): Country[] => {
  const countryList = getCountries()
  return countryList
    .filter((code) => MAJOR_COUNTRIES.includes(code))
    .map((code) => ({
      code,
      dialCode: `+${getCountryCallingCode(code)}`,
      name: new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export const countries = getFormattedCountries()
