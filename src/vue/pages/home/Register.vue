<template>
    <div class="uk-flex uk-flex-middle uk-flex-center uk-padding-small" uk-height-viewport="offset-top: true">
        
        <form @submit.prevent="register" class="uk-card uk-border-rounded uk-card-default uk-width-1-1 uk-width-2-3@m">
                <div class="uk-card-body">

                    <div class="uk-grid-small" uk-grid>

                        <!-- Icon -->
                        <div class="uk-width-auto uk-padding-small">
                            <div class="uk-placeholder uk-padding-remove">
                                <!-- <img src="../../../assets/plugin.svg" :alt="plugin.title || 'Plugin Icon'" ref="pluginIcon"> -->
                                <croppa 
                                    v-model="croppa"
                                    :width="150"
                                    :height="150"
                                    :disable-click-to-chose="true"
                                    :placeholder-font-size="16"
                                    :quality="2.56"
                                    :replace-drop="true"
                                    :zoom-speed="10"
                                    placeholder="Choose Icon"
                                    initial-size="cover"
                                    initial-position="center">
                                    <!-- <img src="../../../assets/plugin.svg" slot="placeholder" /> -->
                                </croppa>
                            </div>
                            <div class="uk-margin-top">
                                <button type="button" @click="croppa.chooseFile()" class="uk-button uk-button-primary uk-width-1-1">
                                    {{plugin.icon? 'CHANGE' : 'UPLOAD'}} ICON
                                </button>
                            </div>
                        </div>

                        <!-- Form -->
                        <div class="uk-width-expand">
                            <div class="uk-margin">
                                <div class="uk-inline uk-width-1-1">
                                    <span class="uk-form-icon">
                                        <i class="fas fa-envelope"></i>
                                    </span>
                                    <input @input="dirty = true" v-model="plugin.title" type="text" name="title" id="title" placeholder="Plugin Title" class="uk-input" :class="{'uk-form-danger': dirty && errors.title}" required>
                                </div>
                                <span class="uk-text-small uk-text-danger" v-if="dirty && errors.title">{{errors.title}}</span>
                            </div>

                            <div class="uk-margin">
                                <div class="uk-inline uk-width-1-1">
                                    <span class="uk-form-icon">
                                        <div uk-spinner="ratio: 0.3" v-if="loading.query"></div>
                                        <i class="fas fa-key" v-else></i>
                                    </span>
                                    <input @input="changeName" v-model="plugin.name" type="text" name="name" id="name" placeholder="Package Name" class="uk-input" :class="{'uk-form-danger': dirty && errors.name}" required>
                                </div>
                                <span class="uk-text-small uk-text-danger" v-if="dirty && errors.name">{{errors.name}}</span>
                            </div>

                            <div class="uk-margin">
                                <textarea @input="dirty = true" v-model="plugin.description" type="text" rows=6 name="name" id="name" placeholder="Plugin Description" class="uk-textarea" :class="{'uk-form-danger': dirty && errors.description}" required></textarea>
                                <!-- <span class="uk-text-small uk-text-danger" v-if="dirty && errors.password">{{errors.password}}</span> -->
                            </div>

                        </div>
                    </div>
                    <div class="uk-margin uk-text-right">

                        <button type="submit" class="uk-button uk-button-primary" :disabled="!valid">
                            <i class="uk-margin-right fas fa-sign-in-alt" v-if="!loading.register"></i>
                            <div class="uk-margin-right" uk-spinner="ratio: 0.3" v-else></div>
                            Register
                        </button>

                    </div>
                </div>
            </form>

    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import axios from 'axios'
    import { mapState } from 'vuex'
    
    import UIkit from 'uikit'

    import {db, storage} from '../../../firebase'

    export default Vue.extend({
        data() {
            return {
                loading: {
                    register: false,
                    query: false
                },
                dirty: false,
                plugin: {
                    title: '',
                    name: '',
                    description: '',
                    icon: null
                },
                croppa: null,
                plugin_details: null,
                timeout: null
            }
        },
        methods: {

            changeName() {

                this.dirty = true

                if (this.timeout) clearTimeout(this.timeout)

                this.timeout = setTimeout(this.fetch_registry, 1000)
            },

            async fetch_registry() {

                const package_name = encodeURIComponent(this.plugin.name.trim())

                try {

                    this.loading.query = true

                    const res = await axios.get(`https://api.npms.io/v2/package/${package_name}`, {
                        headers: {
                            'Accept': 'application/json'
                        }
                    })

                    if (res.status === 200) {

                        this.plugin_details = res.data.collected

                        if (!this.plugin.description) {

                            this.plugin.description = this.plugin_details.metadata.description
                        }

                    }

                    else {
                        this.plugin_details = null
                    }
                }

                catch (err) {

                    console.warn(err)
                }

                finally {

                    this.loading.query = false
                }
            },

            reset() {
                this.plugin = {
                    title: '',
                    name: '',
                    description: '',
                    icon: null
                }

                this.dirty = false

                this.croppa.remove()
            },

            async upload(id) {
                
                if (this.croppa.hasImage()) {

                    const blob = await this.croppa.promisedBlob('image/png')

                    const ref = storage.ref('plugin_icons').child(`${id}.png`)

                    const snap = await ref.put(blob, {
                        contentType: 'image/png'
                    })

                    const url = await ref.getDownloadURL()

                    console.log(snap, url)

                    return url.toString()

                }

                return null
            },

            async register() {

                if (this.user && this.valid) {

                    const plugin = {
                        id: null,
                        name: this.plugin.name.trim(),
                        title: this.plugin.title.trim(),
                        description: this.plugin.description.trim(),
                        icon: null,
                        author: this.user.username
                    }

                    try {

                        this.loading.register = true

                        // generate document
                        const doc = db.collection('plugins').doc()

                        plugin.id = doc.id

                        // upload image
                        plugin.icon = await this.upload(plugin.id)

                        // add plugin to db
                        await doc.set(plugin)

                        UIkit.notification(`Registered ${plugin.name}.`, {status: 'success'})

                        // reset fields
                        this.reset()

                    }

                    catch (err) {

                        console.warn(`Couldn't register plugin ${plugin.name}: ${err}`)

                        UIkit.notification('Couldn\'t register plugin', {status: 'danger'})
                    }

                    finally {
                        this.loading.register = false
                    }
                }

                else {

                    console.warn('Unauthorized request')

                    UIkit.notification('Unauthorized request.', {status: 'danger'})
                }
            }
        },
        computed: {

            ...mapState(['user']),

            errors() {

                const errors = {}

                // title

                const title = this.plugin.title.trim()
                const title_regex = /^[A-Za-z\s\.\-\_0-9]+$/

                if(!title) {
                    errors['title'] = 'The title field cannot be empty'
                }

                else if (!title_regex.test(title)) {
                    errors['title'] = 'The title can only contain alphabets, numbers, dots (.), hyphen (-) and underscores (_)'
                }

                // name

                const name = this.plugin.name.trim()

                if(!name) {
                    errors['name'] = 'The name field cannot be empty'
                }

                else if (!this.plugin_details) {
                    errors['name'] = `${name} is not an npm package`
                }

                // description
                const description = this.plugin.description.trim()

                if (!description) {
                    errors['description'] = 'The description field cannot be empty'
                }

                return errors
            },

            valid() {
                return !this.errors.title && !this.errors.name && !this.errors.description
            }

        },
        beforeMount() {
            this.$store.dispatch('setTitle', 'Add Plugin')
        }
    })
</script>

<style lang="scss">
    
    textarea {
        resize: none;
    }

    .croppa-container {
        position: relative;

        svg.icon.icon-remove {
            position: absolute;
        }
    }
</style>