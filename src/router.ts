import Vue from 'vue'
import VueRouter from 'vue-router'

import LoginPage from './vue/pages/Login.vue'
import SignupPage from './vue/pages/Signup.vue'
import HomePage from './vue/pages/Home.vue'

import DashboardPage from './vue/pages/home/Dashboard.vue'

import PluginListPage from './vue/pages/home/List.vue'
import PluginRegisterPage from './vue/pages/home/Register.vue'

import firebase from 'firebase/app'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginPage
        },
        {
            path: '/signup',
            name: 'signup',
            component: SignupPage
        },
        {
            path: '/home',
            name: 'home',
            component: HomePage,
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: DashboardPage
                },
                {
                    path: '/plugins',
                    name: 'plugins.list',
                    component: PluginListPage
                },
                {
                    path: '/add_plugin',
                    name: 'plugins.register',
                    component: PluginRegisterPage
                }
            ]
        },
        {
            path: '',
            redirect: {name: 'login'}
        }
    ]
})

router.beforeEach((to, from, next) => {

    const currentUser = firebase.auth().currentUser

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    if (requiresAuth && !currentUser) next('login')

    else if (!requiresAuth && currentUser) next('home')

    else next()
})


export default router