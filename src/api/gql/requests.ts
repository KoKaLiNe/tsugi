export const getTopAnime =  /* GraphQL */ `
    query GetTopAnime($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: ANIME, sort: POPULARITY_DESC) {
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
      }
    }
  `