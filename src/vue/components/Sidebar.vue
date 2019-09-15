<template>
    <div class="uk-section uk-section-secondary uk-padding-remove" id="sidebar">
        <div class="logo uk-padding-small uk-text-large">
            Label<b>More</b><sup>dev</sup>
        </div>
        <div class="uk-flex uk-flex-middle uk-padding-small" id="user-info" v-if="user">
            <div class="uk-width-auto" id="user-image">
                <img class="uk-border-circle" width="30" height="30" src="../../assets/manager.svg" alt="manager">
            </div>
            <div class="uk-width-expand uk-margin-left" id="user-detail">
                <div class="uk-text-primary">{{user.name}}</div>
                <div class="uk-text-meta">@{{user.username}}</div>
            </div>

        </div>

        <ul class="uk-list uk-sidebar-list uk-margin-remove">
            <router-link tag="li" :to="{name: 'dashboard'}">
                <a><i class="fas fa-tachometer-alt icon"></i> Dashboard</a>
            </router-link>
            <router-link tag="li" :to="{name: 'plugins.list'}">
                <a><i class="fas fa-plug icon"></i> Plugins</a>
            </router-link>
            <router-link tag="li" :to="{name: 'plugins.register'}">
                <a><i class="far fa-plus-square icon"></i> Add Plugin</a>
            </router-link>
        </ul>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'

    export default Vue.extend({
        props: ['user']
    })
</script>

<style lang="scss" scoped>
    #sidebar {
        min-width: 200px;
        height: 100%;
        overflow-y: auto;
    }

    #user-info {
        background: transparentize(white, 0.85);
        background-blend-mode: overlay;
    }
</style>