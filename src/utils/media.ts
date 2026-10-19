import type { MediaWithTitle } from "@/types/MediaWithTitle";

export function getMediaTitle(media?: MediaWithTitle | null, fallback = "—") {
    const title = media?.title?.english ?? media?.title?.romaji ?? media?.title?.native ?? fallback
    return String(title).charAt(0).toUpperCase() + String(title).slice(1)
}