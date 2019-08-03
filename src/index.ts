import Vue from 'vue'

// import store
import store from './vue/store'

// import router
import router from './router'

// Import style
import './scss/app.scss'

// Import App
import App from './vue/App.vue'

// setup uikit
import UIkit from 'uikit'
(<any>window).UIkit = UIkit

import {auth} from './firebase'

/*
 |----------------------------------------------------------
 | App Created Here
 |----------------------------------------------------------
*/

let app: any;

auth.onAuthStateChanged(() => {

    if (!app) {
        app = new Vue({
            render: h => h(App),
            store,
            router
        }).$mount('#app')
    }
})