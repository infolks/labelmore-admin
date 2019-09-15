<template>
    <div class="uk-section uk-section-default uk-padding-remove">
        <nav class="uk-navbar-container uk-navbar-transparent" uk-navbar>
            <div class="uk-navbar-left">
                <a href="#" class="uk-navbar-toggle">
                    <i class="fas fa-bars"></i>
                </a>
                <div class="uk-navbar-tem uk-logo">
                    {{$store.state.title}}
                </div>
            </div>
            <div class="uk-navbar-right">
                <div v-if="user">
                    <div class="uk-navbar-item uk-flex uk-flex-middle" id="user-dropdown-trigger">
                        <img class="uk-border-circle" width="30" height="30" src="../../assets/manager.svg" alt="manager">
                        <div class="uk-margin-left uk-text-small uk-width-expand">
                            <div>{{user.name}}</div>
                            <div class="uk-text-meta" style="font-size:0.7rem">@{{user.username}}</div>
                        </div>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="uk-margin-remove" id="user-dropdown" uk-dropdown="mode: click; pos: bottom-right; trigger: user-dropdown-trigger">
                        <ul class="uk-nav uk-dropdown-nav">
                            <!-- <li>
                                <a>
                                    <i class="fas fa-user-circle uk-margin-right"></i> My Profile
                                </a>
                            </li>
                            <li>
                                <a>
                                    <i class="fas fa-address-card uk-margin-right"></i> My Account
                                </a>
                            </li> -->
                            <li>
                                <a @click="signout">
                                    <i class="fas fa-sign-out-alt uk-margin-right"></i> Sign Out
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import UIkit from 'uikit'

    import {auth} from '../../firebase'

    export default Vue.extend({
        props: ['user'],

        methods: {

            async signout() {

                try {

                    await auth.signOut()

                    this.$router.replace('login')
                }

                catch (err) {

                    console.warn(err)

                    UIkit.notification(`Couldn't signout user`, {status: 'danger'})
                }
            }
        }
    })
</script>

<style lang="scss" scoped>
    #user-dropdown-trigger {
        cursor: pointer;
        transition: background 0.3s ease-in;
        min-width: 200px;

        &:hover {
            background: rgba(0,0,0,0.1);
        }
    }
</style>