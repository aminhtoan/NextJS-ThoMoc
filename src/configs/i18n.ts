import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'

i18n
  .use(HttpBackend)

  // Enable automatic language detection
  .use(LanguageDetector)

  // Enables the hook initialization module
  .use(initReactI18next)
  .init({
    // nếu mày muốn f5 vày chuyền về ngôn ngữ mặc đc thì bật dòng này lên, nếu k thì thôi
    // lng: 'en',
    backend: {
      /* translation file path */
      loadPath: '/locales/{{lng}}.json'
    },
    fallbackLng: 'en',
    debug: false,
    keySeparator: false,
    detection: {
      order: ['localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'sessionStorage']
    },
    react: {
      useSuspense: true
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    }
  })

export default i18n

export const LANGUAGE_OPTIONS = [
  { value: 'vi', lang: 'Tiếng Việt' },
  { value: 'en', lang: 'English' }
]
