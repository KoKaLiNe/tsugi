import { createRouter, createWebHashHistory } from "vue-router";

export enum RouterEnum {
    Home = "home",
    Schedule = "schedule",
    Anime = "anime",
    Search = "search",
}

const ANY_ROUTE = ':pathMatch(.*)';

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: RouterEnum.Home,
            component: () => import('../views/HomeView.vue'),
        },
        {
            path: '/schedule',
            name: RouterEnum.Schedule,
            component: () => import('../views/ScheduleView.vue'),
        },
        {
            path: '/anime/:id',
            name: RouterEnum.Anime,
            component: () => import('../views/AnimeView.vue'),
        },
        {
            path: '/search',
            name: RouterEnum.Search,
            component: () => import('../views/SearchView.vue'),
        },
        {
            path: `/${ANY_ROUTE}`,
            redirect: { name: RouterEnum.Home, params: {} },
        },
    ]
})


export default router;

