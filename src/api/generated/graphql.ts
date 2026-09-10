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

export type AnimeCardMediaFragment = { id: number, idMal: number | null, bannerImage: string | null, averageScore: number | null, title: { romaji: string | null, english: string | null, native: string | null } | null, coverImage: { large: string | null, color: string | null } | null };

export type TopAnimePageInfoFragment = { total: number | null, currentPage: number | null, lastPage: number | null, hasNextPage: boolean | null, perPage: number | null };

export type GetTopAnimeQueryVariables = Exact<{
  page?: number | null | undefined;
  perPage?: number | null | undefined;
}>;


export type GetTopAnimeQuery = { Page: { pageInfo: { total: number | null, currentPage: number | null, lastPage: number | null, hasNextPage: boolean | null, perPage: number | null } | null, media: Array<{ id: number, idMal: number | null, bannerImage: string | null, averageScore: number | null, title: { romaji: string | null, english: string | null, native: string | null } | null, coverImage: { large: string | null, color: string | null } | null } | null> | null } | null };

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
