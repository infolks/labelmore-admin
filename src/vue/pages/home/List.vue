<template>
    <div>

    </div>
</template>

<script lang="ts">
    import Vue from 'vue'

    export default Vue.extend({
        beforeMount() {
            this.$store.dispatch('setTitle', 'Plugins')
        }
    })
</script>

<style scoped>

</style>