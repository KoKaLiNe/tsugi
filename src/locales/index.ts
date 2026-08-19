import { createI18n } from 'vue-i18n'
import ru from './ru.json'
import en from './en.json'

const savedLocale = localStorage.getItem('locale') || 'ru'


const i18n = createI18n({
    locale: savedLocale,
    fallbackLocale: 'ru',
    legacy: false,
    globalInjection: true,
    messages: { ru, en }
})

export default i18n