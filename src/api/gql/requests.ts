const animeCardMedia = /* GraphQL */ `
  fragment AnimeCardMedia on Media {
    id
    title {
      romaji
      english
      native
    }
    averageScore
    coverImage {
      color
      medium
      extraLarge
    }
    startDate {
      year
    }
    format
  }
`
const pageInfo = /* GraphQL */ `
  fragment RequestPageInfo on PageInfo {
    total
    perPage
    currentPage
    lastPage
    hasNextPage
  }
`
export const getTopAnime = /* GraphQL */ `
  ${animeCardMedia}
  ${pageInfo}

  fragment TopAnimeMedia on Media {
    ...AnimeCardMedia
    bannerImage
    episodes
  }

  query GetTopAnime($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        ...RequestPageInfo
      }
      media(type: ANIME, sort: [TRENDING_DESC, POPULARITY_DESC], isAdult: false) {
        ...TopAnimeMedia
      }
    }
  }
`

export const getSchedule = /* GraphQL */ `
  fragment SchedulePageInfo on PageInfo {
    hasNextPage
  }
  fragment ScheduleMedia on Media {
    id
    title {
      english
      romaji
    }
    coverImage {
      color
      large
      extraLarge
    }
    isAdult
  }
  fragment AiringSchedules on AiringSchedule {
    id
    airingAt
    episode
    media {
      ...ScheduleMedia
    }
  }

  query GetSchedule($start: Int, $end: Int, $page: Int) {
    Page(page: $page, perPage: 50) {
      pageInfo {
        ...SchedulePageInfo
      }
      airingSchedules(
        airingAt_greater: $start
        sort: TIME
        airingAt_lesser: $end
      ) {
        ...AiringSchedules
      }
    }
  }
`

export const search = /* GraphQL */ ` 
  ${pageInfo}
  ${animeCardMedia}

  fragment SearchListMedia on Media {
    ...AnimeCardMedia
    season
    genres
    isAdult
  }
  
  query GetSearchList($page: Int, $perPage: Int = 20, $search: String) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        ...RequestPageInfo
      }
      media(
        type: ANIME,
        sort: POPULARITY_DESC,
        isAdult: false,
        search: $search
      ) {
        ...SearchListMedia
      }
    }
  }
`

export const getAnimeById = /* GraphQL */ ` 
  fragment AnimeByIdMedia on Media {
    id
    title {
      romaji
      english
      native
    }
    coverImage {
      color
      extraLarge
    }
    bannerImage
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    isAdult
    description
    duration
    source(version: 3)
    season
    seasonYear
    popularity
    airingSchedule(notYetAired: true) {
      nodes {
        airingAt
        episode
        id
      }
    }
    nextAiringEpisode { 
      episode 
      airingAt 
    }
    averageScore
    genres
    format
    status(version: 3)
    episodes
    studios(isMain: true) {
      nodes {
        id
        name
      }
    }
    trailer {
      id
      site
      thumbnail
    }
  }
  
  query GetAnimeById($id: Int!) {
    Media(id: $id, type: ANIME) {
      ...AnimeByIdMedia
    }
  }
`
