import { createApp } from 'vue'
import '@/styles/common.scss'
import '@/styles/theme.scss'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia';
import i18n from './locales'
import naive from 'naive-ui'
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import duration from 'dayjs/plugin/duration';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import ru from 'dayjs/locale/ru';

dayjs.extend(isoWeek)
dayjs.extend(duration)
dayjs.extend(isSameOrBefore)
dayjs.locale(ru)

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.use(naive);

app.mount('#app')
