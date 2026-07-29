export interface GglResponse {
    Page: IPage;
}

export interface IPage {
    media: IMedia[];
    pageInfo: IPageInfo;
}

export interface IMedia {
    id: number;
    idMal: number;
    title: ITitle;
    bannerImage: string;
    coverImage: ICoverImage;
    averageScore: number;
}

export interface ITitle {
    romaji: string;
    english: string;
    native: string;
}

export interface ICoverImage {
    large: string;
    medium: string;
}

export interface IPageInfo {
    total: number;
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
    perPage: number;
}
