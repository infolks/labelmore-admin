<template>
    <div class="uk-section uk-section-muted uk-padding-remove">
        <div class="uk-container uk-flex uk-flex-middle uk-flex-center" uk-height-viewport>

            <form @submit.prevent="login" class="uk-card uk-border-rounded uk-card-default uk-width-1-1 uk-width-1-2@m">
                <div class="uk-card-header">
                    <h3 class="uk-card-title">
                        <i class="uk-margin-right fas fa-sign-in-alt"></i> Sign In
                    </h3>
                </div>
                <div class="uk-card-body">
                    <div class="uk-margin">
                        <div class="uk-inline uk-width-1-1">
                            <span class="uk-form-icon">
                                <i class="fas fa-envelope"></i>
                            </span>
                            <input @input="dirty = true" v-model="email" type="email" name="email" id="email" placeholder="Email" class="uk-input" :class="{'uk-form-danger': dirty && errors.email}" required>
                        </div>
                        <span class="uk-text-small uk-text-danger" v-if="dirty && errors.email">{{errors.email}}</span>
                    </div>

                    <div class="uk-margin">
                        <div class="uk-inline uk-width-1-1">
                            <span class="uk-form-icon">
                                <i class="fas fa-key"></i>
                            </span>
                            <input @input="dirty = true" v-model="password" type="password" name="password" id="password" placeholder="Password" class="uk-input" :class="{'uk-form-danger': dirty && errors.password}" required>
                        </div>
                        <span class="uk-text-small uk-text-danger" v-if="dirty && errors.password">{{errors.password}}</span>
                    </div>

                    <div class="uk-margin uk-text-center">
                        <button type="submit" class="uk-button uk-button-primary" :disabled="!valid">
                            <i class="uk-margin-right fas fa-sign-in-alt" v-if="!loading"></i>
                            <div class="uk-margin-right" uk-spinner="ratio: 0.3" v-else></div>
                            Sign In
                        </button>
                    </div>
                </div>
                <div class="uk-card-footer uk-text-center">
                    Don't have an account? <router-link :to="{name: 'signup'}">Sign up here</router-link>
                </div>
            </form>

        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'

    import {auth, db} from '../../firebase'

    import UIkit from 'uikit'

    export default Vue.extend({
        data() {
            return {
                email: '',
                password: '',
                dirty: false,
                loading: false
            }
        },

        computed: {

            errors() {

                const errors = {}

                const email_regex       = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
                const password_regex    = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/

                if (!this.email.trim()) {
                    errors['email'] = "email field cannot be empty"
                } 

                else if (!email_regex.test(this.email.trim())) {
                    errors['email'] = 'enter a valid email address'
                }

                if (!this.password.trim()) {
                    errors['password'] = "password field cannot be empty"
                }

                else if (this.password.trim().length < 8) {
                    errors['password'] = "password must have atleast 8 characters"
                }

                else if (!password_regex.test(this.password.trim())) {
                    errors['password'] = "password must contain atleast 1 number,and a special character"
                }

                return errors

            },

            valid() {
                return !this.errors.email && !this.errors.password
            }
        },

        methods: {

            async login() {

                if (this.valid) {

                    this.loading = true

                    try {

                        const cred = await auth.signInWithEmailAndPassword(this.email.trim(), this.password.trim())

                        const user = await db.collection('users').doc(cred.user.uid).get()

                        this.$store.dispatch('login', user.data())

                        UIkit.notification(`Logged in as ${user.data().username}`, {status: 'success'})

                        this.$router.replace('home')

                    }

                    catch (err) {

                        console.warn(err)

                        UIkit.notification(`Error while signing in`, {status: 'danger'})

                    }

                    finally {

                        this.loading = false

                    }
                }
            }
        }
    })
</script>