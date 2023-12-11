import Vue from 'vue';
import Router from 'vue-router';
import LogLoader from '@/components/LogLoader.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: LogLoader,
            props: (route) => ({ pageUrl: decodeURIComponent(route.query.pageUrl || '') }),
        },
    ],
});

