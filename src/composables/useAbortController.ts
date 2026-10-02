import { onScopeDispose } from "vue";

export function useAbortController() {
    let controller: AbortController | null = null;

    const getAbortController = () => {
        controller?.abort()
        controller = new AbortController()

        return controller
    }

    const clearAbortController = () => {
        controller?.abort()
        controller = null
    }

    const isCurrentController = (controllerToCheck: AbortController) => {
        return controller === controllerToCheck
    }

    onScopeDispose(() => {
        clearAbortController()
    })

    return { isCurrentController, clearAbortController, getAbortController }
}