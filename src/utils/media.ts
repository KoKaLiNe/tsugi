import type { MediaWithTitle } from "@/types/MediaWithTitle";

const IMAGE_HOST = 'https://s4.anilist.co'

export function getMediaTitle(media?: MediaWithTitle | null, fallback = "—") {
    const title = media?.title?.english ?? media?.title?.romaji ?? media?.title?.native ?? fallback
    return String(title).charAt(0).toUpperCase() + String(title).slice(1)
}

export function proxyImageUrl(url?: string | null) {
    if (!url) {
        return undefined
    }

    return import.meta.env.PROD && url.startsWith(IMAGE_HOST)
        ? url.replace(IMAGE_HOST, '/img')
        : url
}