import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: null,
        title: 'Dashboard'
    },
    getters: {

    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },

        setTitle(state, title) {
            state.title = title
        }
    },
    actions: {
        login(context, user) {
            context.commit('setUser', user)
        },
        logout(context) {
            context.commit('setUser', null)
        },

        setTitle(context, title) {
            context.commit('setTitle', title)
        }
    }
})