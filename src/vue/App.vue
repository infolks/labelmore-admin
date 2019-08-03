<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import * as firebase from 'firebase/app'
    import UIkit from 'uikit'

    export default Vue.extend({
        name: 'my-app',
        data() {
            return {
                title: 'Vue Starter'
            }
        },

        created() {

            const user = firebase.auth().currentUser

            if (user) {

                firebase.firestore()
                    .collection('users')
                    .doc(user.uid).get()
                    .then(user => {

                        this.$store.dispatch('login', user.data())

                    })
                    .catch(err => {
                        
                        console.warn('Error fetching user', err)
                        UIkit.notification(`An error occured while fetching user.`, {status: 'danger'})

                    })
            }
        }
    })
</script>
