import { onScopeDispose, readonly, ref } from "vue"

const TIMER_INTERVAL = 30_000

const now = ref(Date.now())
let subscribers = 0
let timerId: ReturnType<typeof setInterval> | null = null

export function useNow() {
    subscribers++

    if (subscribers === 1) {
        now.value = Date.now()

        timerId = setInterval(() => {
            now.value = Date.now()
        }, TIMER_INTERVAL)
    }

    onScopeDispose(() => {
        subscribers--

        if (timerId && subscribers === 0) {
            clearInterval(timerId)
            timerId = null
        }
    })

    return readonly(now)
}