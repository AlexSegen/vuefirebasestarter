<template>
    <div class="login">
        <Hero title="VueFire Starter" subtitle="Vue & Firebase Authentication, CRUD and File Store boilerplate."/>
        <div class="card-auth">
            <div class="card-content ">
                <div class="field">
                    <h1>Sign In</h1>
                </div>
                <div class="field">
                <p class="control has-icons-left has-icons-right">
                    <input class="input" type="email" placeholder="Email" v-model="email" :disabled="authenticating">
                    <span class="icon is-left">
                    <i class="fas fa-envelope"></i>
                    </span>
                    <span class="icon is-right has-text-success" v-if="emailReady">
                        <i class="fas fa-check"></i>
                    </span>
                </p>
                </div>
                <div class="field">
                <p class="control has-icons-left has-icons-right">
                    <input class="input" type="password" placeholder="Password" v-model="password" :disabled="authenticating">
                    <span class="icon is-left">
                    <i class="fas fa-lock"></i>
                    </span>
                    <span class="icon is-right has-text-success" v-if="passwordReady">
                        <i class="fas fa-check"></i>
                    </span>
                </p>
                </div>
                <div class="field">
                    <p>Don't have an account? <router-link to="/register">Create one</router-link></p>
                </div>
                <div class="field">
                    <p class="control">
                        <button class="button is-success" :class="{'is-loading': authenticating}" type="button" @click="handleLogin">
                        Login
                        </button>
                    </p>
                </div>
                <hr>
                <div class="field">
                    <h1>Social login</h1>
                </div>
                <div class="field">
                    <button class="button is-danger" :class="{'is-loading': authenticating}" type="button" @click="handleGoogleLogin"><i class="fab fa-google fa-fw"></i> Sign In with Google</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {firebase, auth} from '@/config/firebase.config'
import { mapGetters, mapActions } from "vuex";

export default {
    name: 'login',
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
          'login', 'loginSocial'
      ]),

      handleLogin() {
          if (this.email != '' && this.password != '') {
            this.login({email: this.email, password: this.password})
            this.password = ""
          }
      },
      handleGoogleLogin() {
          this.loginSocial();
      },
      checkNewUser() {
        return this.$route.query.register == 'success'
      }
  }
}
</script>

<style lang="scss">
.card-auth {
    max-width: 350px;
    margin: 10px auto;
}
</style>
