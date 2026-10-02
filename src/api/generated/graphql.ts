/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** The format the media was released in */
export type MediaFormat =
  /** Professionally published manga with more than one chapter */
  | 'MANGA'
  /** Anime movies with a theatrical release */
  | 'MOVIE'
  /** Short anime released as a music video */
  | 'MUSIC'
  /** Written books released as a series of light novels */
  | 'NOVEL'
  /** (Original Net Animation) Anime that have been originally released online or are only available through streaming services. */
  | 'ONA'
  /** Manga with just one chapter */
  | 'ONE_SHOT'
  /** (Original Video Animation) Anime that have been released directly on DVD/Blu-ray without originally going through a theatrical release or television broadcast */
  | 'OVA'
  /** Special episodes that have been included in DVD/Blu-ray releases, picture dramas, pilots, etc */
  | 'SPECIAL'
  /** Anime broadcast on television */
  | 'TV'
  /** Anime which are under 15 minutes in length and broadcast on television */
  | 'TV_SHORT';

export type MediaSeason =
  /** Predominantly started airing between October and November */
  | 'FALL'
  /** Predominantly started airing between April and June */
  | 'SPRING'
  /** Predominantly started airing between July and September */
  | 'SUMMER'
  /** Predominantly started airing between January and March */
  | 'WINTER';

/** Source type the media was adapted from */
export type MediaSource =
  /** Version 2+ only. Japanese Anime */
  | 'ANIME'
  /** Version 3 only. Comics excluding manga */
  | 'COMIC'
  /** Version 2+ only. Self-published works */
  | 'DOUJINSHI'
  /** Version 3 only. Games excluding video games */
  | 'GAME'
  /** Written work published in volumes */
  | 'LIGHT_NOVEL'
  /** Version 3 only. Live action media such as movies or TV show */
  | 'LIVE_ACTION'
  /** Asian comic book */
  | 'MANGA'
  /** Version 3 only. Multimedia project */
  | 'MULTIMEDIA_PROJECT'
  /** Version 2+ only. Written works not published in volumes */
  | 'NOVEL'
  /** An original production not based of another work */
  | 'ORIGINAL'
  /** Other */
  | 'OTHER'
  /** Version 3 only. Picture book */
  | 'PICTURE_BOOK'
  /** Video game */
  | 'VIDEO_GAME'
  /** Video game driven primary by text and narrative */
  | 'VISUAL_NOVEL'
  /** Version 3 only. Written works published online */
  | 'WEB_NOVEL';

/** The current releasing status of the media */
export type MediaStatus =
  /** Ended before the work could be finished */
  | 'CANCELLED'
  /** Has completed and is no longer being released */
  | 'FINISHED'
  /** Version 2 only. Is currently paused from releasing and will resume at a later date */
  | 'HIATUS'
  /** To be released at a later date */
  | 'NOT_YET_RELEASED'
  /** Currently releasing */
  | 'RELEASING';

export type AnimeCardMediaFragment = { id: number, idMal: number | null, bannerImage: string | null, format: MediaFormat | null, episodes: number | null, averageScore: number | null, title: { romaji: string | null, english: string | null, native: string | null } | null, coverImage: { large: string | null, color: string | null } | null };

export type TopAnimePageInfoFragment = { total: number | null, currentPage: number | null, lastPage: number | null, hasNextPage: boolean | null, perPage: number | null };

export type GetTopAnimeQueryVariables = Exact<{
  page?: number | null | undefined;
  perPage?: number | null | undefined;
}>;


export type GetTopAnimeQuery = { Page: { pageInfo: { total: number | null, currentPage: number | null, lastPage: number | null, hasNextPage: boolean | null, perPage: number | null } | null, media: Array<{ id: number, idMal: number | null, bannerImage: string | null, format: MediaFormat | null, episodes: number | null, averageScore: number | null, title: { romaji: string | null, english: string | null, native: string | null } | null, coverImage: { large: string | null, color: string | null } | null } | null> | null } | null };

export type SchedulePageInfoFragment = { hasNextPage: boolean | null };

export type ScheduleMediaFragment = { id: number, isAdult: boolean | null, title: { english: string | null, romaji: string | null } | null, coverImage: { color: string | null, large: string | null, extraLarge: string | null } | null };

export type AiringSchedulesFragment = { id: number, airingAt: number, episode: number, media: { id: number, isAdult: boolean | null, title: { english: string | null, romaji: string | null } | null, coverImage: { color: string | null, large: string | null, extraLarge: string | null } | null } | null };

export type GetScheduleQueryVariables = Exact<{
  start?: number | null | undefined;
  end?: number | null | undefined;
  page?: number | null | undefined;
}>;


export type GetScheduleQuery = { Page: { pageInfo: { hasNextPage: boolean | null } | null, airingSchedules: Array<{ id: number, airingAt: number, episode: number, media: { id: number, isAdult: boolean | null, title: { english: string | null, romaji: string | null } | null, coverImage: { color: string | null, large: string | null, extraLarge: string | null } | null } | null } | null> | null } | null };

export type SearchListPageInfoFragment = { total: number | null, perPage: number | null, currentPage: number | null, lastPage: number | null, hasNextPage: boolean | null };

export type SearchListMediaFragment = { id: number, averageScore: number | null, season: MediaSeason | null, genres: Array<string | null> | null, format: MediaFormat | null, isAdult: boolean | null, title: { english: string | null, romaji: string | null } | null, coverImage: { color: string | null, medium: string | null } | null, startDate: { year: number | null } | null };

export type GetSearchListQueryVariables = Exact<{
  page?: number | null | undefined;
  perPage?: number | null | undefined;
  search?: string | null | undefined;
}>;


export type GetSearchListQuery = { Page: { pageInfo: { total: number | null, perPage: number | null, currentPage: number | null, lastPage: number | null, hasNextPage: boolean | null } | null, media: Array<{ id: number, averageScore: number | null, season: MediaSeason | null, genres: Array<string | null> | null, format: MediaFormat | null, isAdult: boolean | null, title: { english: string | null, romaji: string | null } | null, coverImage: { color: string | null, medium: string | null } | null, startDate: { year: number | null } | null } | null> | null } | null };

export type AnimeByIdMediaFragment = { id: number, bannerImage: string | null, isAdult: boolean | null, description: string | null, duration: number | null, source: MediaSource | null, season: MediaSeason | null, seasonYear: number | null, popularity: number | null, averageScore: number | null, genres: Array<string | null> | null, format: MediaFormat | null, status: MediaStatus | null, episodes: number | null, title: { romaji: string | null, english: string | null, native: string | null } | null, coverImage: { color: string | null, extraLarge: string | null } | null, startDate: { year: number | null, month: number | null, day: number | null } | null, endDate: { year: number | null, month: number | null, day: number | null } | null, airingSchedule: { nodes: Array<{ airingAt: number, episode: number, id: number } | null> | null } | null, nextAiringEpisode: { episode: number, airingAt: number } | null, studios: { nodes: Array<{ id: number, name: string } | null> | null } | null, trailer: { id: string | null, site: string | null, thumbnail: string | null } | null };

export type GetAnimeByIdQueryVariables = Exact<{
  id: number;
}>;


export type GetAnimeByIdQuery = { Media: { id: number, bannerImage: string | null, isAdult: boolean | null, description: string | null, duration: number | null, source: MediaSource | null, season: MediaSeason | null, seasonYear: number | null, popularity: number | null, averageScore: number | null, genres: Array<string | null> | null, format: MediaFormat | null, status: MediaStatus | null, episodes: number | null, title: { romaji: string | null, english: string | null, native: string | null } | null, coverImage: { color: string | null, extraLarge: string | null } | null, startDate: { year: number | null, month: number | null, day: number | null } | null, endDate: { year: number | null, month: number | null, day: number | null } | null, airingSchedule: { nodes: Array<{ airingAt: number, episode: number, id: number } | null> | null } | null, nextAiringEpisode: { episode: number, airingAt: number } | null, studios: { nodes: Array<{ id: number, name: string } | null> | null } | null, trailer: { id: string | null, site: string | null, thumbnail: string | null } | null } | null };
