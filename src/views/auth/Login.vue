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
                    <p class="control">
                        <button class="button is-success" :class="{'is-loading': authenticating}" type="button" @click="handleLogin">
                        Log In
                        </button>
                    </p>
                </div>
                <div class="field">
                    <p>Or</p>
                </div>
                <div class="field">
                    <social-auth/>
                </div>
                <hr>
                <div class="field">
                    <p><router-link to="/recover-password">Don't remember your password?</router-link></p>
                </div>
                <div class="field">
                    <p><router-link to="/register">Don't have an account?</router-link></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import validate from '@/libs/validations'
import { mapGetters, mapActions } from "vuex";
import SocialAuth from '@/components/auth/_SocialAuth'

export default {
    name: 'login',
    components: { SocialAuth },
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
        return validate.email(this.email);
    },
    passwordReady() {
        return this.password.trim().length > 7
    }
  },
  methods: {
      ...mapActions('auth', ['login']),
      handleLogin() {
          if (this.email != '' && this.password != '') {
            this.login({email: this.email, password: this.password})
            this.password = ""
          }
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
