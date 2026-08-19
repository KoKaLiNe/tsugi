export const getTopAnime = /* GraphQL */ `
  fragment AnimeCardMedia on Media {
    id
    idMal
    title {
      romaji
      english
      native
    }
    bannerImage
    coverImage {
      large
      color
    }
    averageScore
  }
  fragment TopAnimePageInfo on PageInfo {
    total
    currentPage
    lastPage
    hasNextPage
    perPage
  }

  query GetTopAnime($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        ...TopAnimePageInfo
      }
      media(type: ANIME, sort: POPULARITY_DESC) {
        ...AnimeCardMedia
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
    }
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