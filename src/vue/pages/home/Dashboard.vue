<template>
    <div>
        dashboard
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'

    export default Vue.extend({
        beforeMount() {
            this.$store.dispatch('setTitle', 'Dashboard')
        }
    })
</script>

<style scoped>

</style>