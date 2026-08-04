import type { MediaWithTitle } from "@/types/MediaWithTitle";

export function getMediaTitle(media: MediaWithTitle, fallback = "—") {
    return media.title?.english ?? media.title?.romaji ?? media.title?.native ?? fallback
}