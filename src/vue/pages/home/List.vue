<template>
    <div class="uk-section uk-padding">
        <table class="uk-table uk-table-divider uk-width-1-1">
            <tr>
                <th>No.</th>
                <th>Title</th>
                <th>Package Name</th>
                <th>Description</th>
            </tr>
            <tr v-for="(plugin,i) in plugins" :key="plugin.id">
                <td>{{i+1}}</td>
                <td>{{plugin.title}}</td>
                <td>{{plugin.name}}</td>
                <td>{{plugin.description | limit}}</td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {db} from '../../../firebase'
    import {mapState} from 'vuex'

    export default Vue.extend({
        data() {
            return {
                plugins: []
            }
        },

        watch: {
            user() {
                this.fetchPlugins()
            }
        },

        computed: {
            ...mapState(['user']),
        },

        methods: {

            fetchPlugins() {

                if (this.user) {
                    db.collection('plugins')
                        .where('author', '==', this.user.username)
                        .onSnapshot((snap) => {

                            console.log(snap)

                            this.plugins = []

                            snap.forEach(doc => {
                                this.plugins.push(doc.data())
                            })
                        })
                }

            }
        },

        created() {

            this.fetchPlugins()

        },

        beforeMount() {
            this.$store.dispatch('setTitle', 'Plugins')
        },
        filters: {
            limit(val: string) {

                if (val.length > 43) {
                    return val.substr(0, 40) + '...'
                }

                return val

            }
        }
    })
</script>

<style scoped>

</style>