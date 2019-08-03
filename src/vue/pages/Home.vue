<template>
    <div class="uk-section uk-section-default uk-padding-remove" uk-height-viewport>
        <div class="uk-grid-collapse" uk-grid>
            <div class="uk-width-auto">
                <app-sidebar :user="user"></app-sidebar>
            </div>
            <div class="uk-width-expand">
                <div class="uk-section uk-section-muted uk-padding-remove" id="content">
                    <app-navbar :user="user"></app-navbar>
                    <div class="page-wrapper">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'

    import * as firebase from 'firebase/app'
    import { mapState } from 'vuex'

    import AppNavbar from '../components/Navbar.vue'
    import AppSidebar from '../components/Sidebar.vue'

    export default Vue.extend({
        computed: {
            ...mapState(['user'])
        },
        components: {
            AppNavbar,
            AppSidebar
        }
    })
</script>

<style scoped>
    #content {
        min-height: 100vh;
    }
</style>