import { createRouter, createWebHashHistory } from "vue-router";

// const ANY_ROUTE = ':pathMatch(.*)';

export enum RouterEnum {
    Home = "home",
    Community = "community",
    Events = "events",
    Movies = "movies",
    Series = "series",
}

const ANY_ROUTE = ':pathMatch(.*)';

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('../views/LayoutView.vue'),
            children: [
                {
                    path: '',
                    name: 'Main',
                    redirect: { name: RouterEnum.Home },
                },
                {
                    path: 'home',
                    name: RouterEnum.Home,
                    component: () => import('../views/HomeView.vue')
                },
            ]
        },
        {
            path: `/${ANY_ROUTE}`,
            redirect: { name: RouterEnum.Home, params: {} },
        },
    ]
})


export default router;

