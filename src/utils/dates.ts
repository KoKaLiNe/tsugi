import dayjs from "dayjs";
import i18n from "@/locales";

export function getWeekRange(date: string) {
    const start = getStartOfWeekDate(date)

    return {
        start: start.unix(),
        end: start.add(1, 'week').unix(),
    }
}

export function getWeekDays(date: string) {
    const weekStart = getStartOfWeekDate(date)
    const weekDays = Array.from({ length: 7 }, (_item, index) => weekStart.add(index, "day"))
    return weekDays
}

export function toDateKey(date: dayjs.Dayjs | string | number = dayjs()) {
    return dayjs(date).format("YYYY-MM-DD")
}

export function getStartOfWeekDate(date: dayjs.Dayjs | string | number = dayjs()) {
    return dayjs(date).startOf("isoWeek")
}

export function getEndOfWeekDate(date: dayjs.Dayjs | string | number = dayjs()) {
    return dayjs(date).endOf("isoWeek")
}

export function getClosestDayName(date: dayjs.Dayjs | string | number, compareDate: dayjs.Dayjs | string | number = dayjs()) {
    const dateValue = dayjs(date)
    const compareDateValue = dayjs(compareDate)
    const dayDifference = dateValue.startOf('day').diff(compareDateValue.startOf('day'), 'day')

    switch (dayDifference) {
        case 0:
            return {
                dayDifference,
                dayName: i18n.global.t('common.dateTime.today')
            }

        case 1:
            return {
                dayDifference,
                dayName: i18n.global.t('common.dateTime.tomorrow')
            }

        default:
            return {
                dayDifference,
                dayName: i18n.global.t(`common.dateTime.atWeekDays.${dateValue.day()}`)
            }
    }
}
