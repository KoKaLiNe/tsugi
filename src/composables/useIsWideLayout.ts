import { useMediaQuery } from "./useMediaQuery"

const BREAKPOINT = "(min-width: 1240px)"

export function useIsWideLayout() {
    return useMediaQuery(BREAKPOINT)
}