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