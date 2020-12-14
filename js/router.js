const router = new VueRouter({
    routes: [
        { path: '/', component: Vue.component('main-page') }
    ]
})
window.router = router;