import dayjs from "dayjs";

export function getWeekRange(date: string) {
    const start = dayjs(date).startOf('isoWeek')

    return {
        start: start.unix(),
        end: start.add(1, 'week').unix(),
    }
}

export function getWeekDays(date: string) {
    const weekStart = dayjs(date).startOf('isoWeek')
    const weekDays = Array.from({ length: 7 }, (_item, index) => weekStart.add(index, "day"))
    return weekDays
}

export function toDateKey(date: dayjs.Dayjs) {
    return date.format("YYYY-MM-DD")
}