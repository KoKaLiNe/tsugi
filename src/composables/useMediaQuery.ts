import { onScopeDispose, ref, readonly } from "vue"

export function useMediaQuery(media: string) {
    const mql = window.matchMedia(media)
    const isMatchLayout = ref(mql.matches)
    const onChange = function () {
        isMatchLayout.value = mql.matches
    }

    mql.addEventListener('change', onChange)

    onScopeDispose(() => {
        mql.removeEventListener('change', onChange)
    })

    return readonly(isMatchLayout)
}