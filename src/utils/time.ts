import i18n from "@/locales";
import dayjs from "dayjs";

export function getFormattedTimeLeft(start: number, end: number) {
    const timeDiff = dayjs.duration(start - end)
    const totalMinutesLeft = Math.ceil(timeDiff.asMinutes())
    const hoursLeft = Math.floor(totalMinutesLeft / 60)
    const minutesLeft = totalMinutesLeft % 60

    let str = ""

    if (hoursLeft) {
        str += `${hoursLeft} ${i18n.global.t('common.dateTime.hour')} `
    }

    if (minutesLeft) {
        str += `${minutesLeft} ${i18n.global.t('common.dateTime.min')}`
    }
    return str
}
