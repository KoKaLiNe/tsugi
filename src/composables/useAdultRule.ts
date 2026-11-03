
import { nextTick, readonly, ref } from "vue"

type AdultFilterType = {
    isUserAdult: boolean;
    timeStamp: number;
}

const CONSENT_TTL = 86_400_000 // 24 часа

const getAdultFilter = () => {
    try {
        const adultFilter: AdultFilterType | null = localStorage.getItem('adult-filter') ? JSON.parse(localStorage.getItem('adult-filter')!) : null

        if (adultFilter) {
            return (Date.now() - adultFilter.timeStamp) < CONSENT_TTL ? adultFilter.isUserAdult : false
        } else {
            return null
        }
    } catch (error) {
        return null
    }
}

const isUserAdult = ref(getAdultFilter() === true)
const showConfirmModal = ref(false)
const focusElement = ref<HTMLElement | null>(null)

export function useAdultRule() {
    const setUserAdultRule = (flag: boolean) => {
        isUserAdult.value = flag;
        localStorage.setItem('adult-filter', JSON.stringify({
            isUserAdult: isUserAdult.value,
            timeStamp: Date.now()
        }))

        if (flag) {
            setFocusElement()
        }
    }

    const setFocusElement = async () => {
        if (focusElement.value) {
            await nextTick()
            focusElement.value.focus()
        }
    }

    return {
        setUserAdultRule,
        isUserAdult: readonly(isUserAdult),
        showConfirmModal,
        focusElement,
    }
}