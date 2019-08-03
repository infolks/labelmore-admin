<template>
    <div class="uk-section uk-section-muted uk-padding-remove">
        <div class="uk-container uk-flex uk-flex-middle uk-flex-center" uk-height-viewport>

            <form @submit.prevent="signup" class="uk-card uk-card-default uk-width-1-1 uk-width-1-2@m">
                <div class="uk-card-header">
                    <h3 class="uk-card-title">
                        <i class="uk-margin-right fas fa-user-plus"></i> Signup
                    </h3>
                </div>
                <div class="uk-card-body">

                    <!-- Name -->

                    <div class="uk-margin">
                        <div class="uk-inline uk-width-1-1">
                            <span class="uk-form-icon">
                                <i class="fas fa-user"></i>
                            </span>
                            <input @input="dirty = true" v-model="name" type="name" name="name" id="name" placeholder="Full Name" class="uk-input" :class="{'uk-form-danger': dirty && errors.name}" required>
                        </div>
                        <span class="uk-text-small uk-text-danger" v-if="dirty && errors.name">{{errors.name}}</span>
                    </div>

                    <!-- Username -->

                    <div class="uk-margin">
                        <div class="uk-inline uk-width-1-1">
                            <span class="uk-form-icon">
                                <i class="fas fa-at"></i>
                            </span>
                            <input @input="dirty = true" v-model="username" type="username" name="username" id="username" placeholder="Username" class="uk-input" :class="{'uk-form-danger': dirty && errors.username}" required>
                        </div>
                        <span class="uk-text-small uk-text-danger" v-if="dirty && errors.username">{{errors.username}}</span>
                    </div>

                    <!-- Email -->

                    <div class="uk-margin">
                        <div class="uk-inline uk-width-1-1">
                            <span class="uk-form-icon">
                                <i class="fas fa-envelope"></i>
                            </span>
                            <input @input="dirty = true" v-model="email" type="email" name="email" id="email" placeholder="Email" class="uk-input" :class="{'uk-form-danger': dirty && errors.email}" required>
                        </div>
                        <span class="uk-text-small uk-text-danger" v-if="dirty && errors.email">{{errors.email}}</span>
                    </div>

                    <!-- Password -->

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
                            <i class="uk-margin-right fas fa-user-plus" v-if="!loading"></i>
                            <div class="uk-margin-right" uk-spinner="ratio: 0.3" v-else></div>
                            Sign Up
                        </button>
                    </div>
                </div>
                <div class="uk-card-footer uk-text-center">
                    Already have an account? <router-link :to="{name: 'login'}">Sign In</router-link>
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
                name: '',
                username: '',
                email: '',
                password: '',
                dirty: false,
                loading: false
            }
        },

        computed: {

            errors() {

                const errors = {}

                // name
                
                const name_regex = /^[a-zA-Z\s]+$/

                if (!this.name.trim()) {
                    errors['name'] = "name field cannot be empty"
                }

                else if (this.name.trim().length < 3) {
                    errors['name'] = "name must have atleast 3 characters"
                }

                else if (!name_regex.test(this.name.trim())) {
                    errors['name'] = "name can only contain alphabets and space"
                }

                //username

                const username_regex = /^[a-zA-Z0-9_\.\-]+$/
                
                if (!this.username.trim()) {
                    errors['username'] = "username field cannot be empty"
                }

                else if (this.username.trim().length < 5) {
                    errors['username'] = "username must have atleast 5 characters"
                }

                else if (!username_regex.test(this.username.trim())) {
                    errors['username'] = "username can only contain alphabets, numbers and _,.,-"
                }

                // Email

                const email_regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

                if (!this.email.trim()) {
                    errors['email'] = "email field cannot be empty"
                } 

                else if (!email_regex.test(this.email)) {
                    errors['email'] = 'enter a valid email address'
                }

                // Password

                const password_regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/

                if (!this.password) {
                    errors['password'] = "password field cannot be empty"
                }

                else if (this.password.length < 8) {
                    errors['password'] = "password must have atleast 8 characters"
                }

                else if (!password_regex.test(this.password)) {
                    errors['password'] = "password must contain atleast 1 number,and a special character"
                }

                return errors

            },

            valid() {
                return !this.errors.email && !this.errors.password
            }
        },

        methods: {

            async signup() {

                if (this.valid) {

                    this.loading = true

                    const user = {
                        id: null,
                        name: this.name.trim(),
                        username: this.username.trim(),
                        email: this.email.trim(),
                        plugins: []
                    }

                    const password = this.password.trim()
                    
                    try {

                        const cred = await auth.createUserWithEmailAndPassword(user.email, password)

                        user.id = cred.user.uid

                        const doc = await db.collection('users').doc(cred.user.uid).set(user)

                        this.$store.dispatch('login', user)

                        UIkit.notification(`Created new user ${user.username}`, {status: 'success'})

                        this.$router.replace('home')

                    }

                    catch (err) {
                        console.warn('Error creating account', err)

                        UIkit.notification(`Error while creating account`, {status: 'danger'})
                    }

                    finally {
                        this.loading = false
                    }
                }
            }
        }
    })
</script>
