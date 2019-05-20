<template>
    <div class="sign-up container">
        <div class="card-auth">
            <div class="card-content ">
                <div class="field">
                    <p>Let's create a new account!</p>
                </div>
                <div class="field">
                <p class="control has-icons-left has-icons-right">
                    <input class="input" type="email" placeholder="Email" v-model="email" :disabled="authenticating">
                    <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                    </span>
                    <span class="icon is-small is-right has-text-success" v-if="emailReady">
                    <i class="fas fa-check"></i>
                    </span>
                </p>
                </div>
                <div class="field">
                <p class="control has-icons-left has-icons-right">
                    <input class="input" type="password" placeholder="Password" v-model="password" :disabled="authenticating">
                    <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                    </span>
                    <span class="icon is-small is-right has-text-success" v-if="passwordReady">
                        <i class="fas fa-check"></i>
                    </span>
                </p>
                </div>
                <div class="field">
                    <p>Already have an account? <router-link to="/login">Login</router-link></p>
                </div>
                <div class="field">
                    <p class="control">
                        <button class="button is-success" :class="{'is-loading': authenticating}" type="button" @click="handleRegister">Register</button>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: 'register',
    data() {
        return {
            email: '',
            password: ''
        }
    },
    computed: {
        ...mapGetters('auth', [
            'authenticating',
            'authenticationError',
            'authenticationErrorCode'
        ]),
        emailReady() {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(this.email).toLowerCase());
        },
        passwordReady() {
            return this.password.trim().length > 5
        }
    },
    methods: {
      ...mapActions('auth', [
          'register'
      ]),
        handleRegister() {
          if (this.emailReady && this.passwordReady) {
            this.register({email: this.email, password: this.password})
            this.password = ""
          }
        }
    }
}
</script>