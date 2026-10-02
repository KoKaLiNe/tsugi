import i18n from "@/locales";
import dayjs from "dayjs";

export function getFormattedTimeLeft(start: number, end: number, needDays = false, fullUnits = false) {
    const timeDiff = dayjs.duration(start - end)
    const totalMinutesLeft = Math.ceil(timeDiff.asMinutes())
    const daysLeft = Math.floor(totalMinutesLeft / 1440)
    const hoursLeft = needDays ? Math.floor(totalMinutesLeft % 1440 / 60) : Math.floor(totalMinutesLeft / 60)
    const minutesLeft = totalMinutesLeft % 60

    let str = ""

    if (daysLeft) {
        str += fullUnits ? `${i18n.global.t('common.dateTime.days', daysLeft)} ` : `${daysLeft} ${i18n.global.t('common.dateTime.day')} `
    }

    if (hoursLeft) {
        str += fullUnits ? `${i18n.global.t('common.dateTime.hours', hoursLeft)} ` : `${hoursLeft} ${i18n.global.t('common.dateTime.hour')} `
    }

    if (minutesLeft && !daysLeft) {
        str += fullUnits ? `${i18n.global.t('common.dateTime.minutes', minutesLeft)}` : `${minutesLeft} ${i18n.global.t('common.dateTime.min')}`
    }
    return str
}
