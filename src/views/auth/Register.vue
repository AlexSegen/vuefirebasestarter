<template>
    <div class="sign-up">
        <Hero title="VueFire Starter" subtitle="Vue & Firebase Authentication, CRUD and File Store boilerplate."/>
        <div class="card-auth">
            <div class="card-content ">
                <div class="field">
                    <p>Let's create a new account!</p>
                </div>
                <div class="field">
                <label for="" class="label">Email</label>
                <p class="control has-icons-left has-icons-right">
                    <input class="input" type="email" placeholder="" v-model="email" :disabled="authenticating">
                    <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                    </span>
                    <span class="icon is-small is-right has-text-success" v-if="emailReady">
                    <i class="fas fa-check"></i>
                    </span>
                </p>
                </div>
                <div class="field">
                    <label for="" class="label">Password</label>
                <p class="control has-icons-left has-icons-right">
                    <input class="input" type="password" placeholder="" v-model="password" :disabled="authenticating">
                    <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                    </span>
                    <span class="icon is-small is-right has-text-success" v-if="passwordReady">
                        <i class="fas fa-check"></i>
                    </span>
                </p>
                </div>

                <div class="field">
                    <label for="" class="label">Confirm your password</label>
                    <p class="control has-icons-left has-icons-right">
                        <input class="input" type="password" placeholder="" v-model="confirmPassword">
                        <span class="icon is-small is-left">
                        <i class="fas fa-lock"></i>
                        </span>
                        <span class="icon is-small is-right has-text-success" v-if="passwordReady">
                            <i class="fas fa-check"></i>
                        </span>
                    </p>
                </div>
                <div class="field">
                    <div class="tag is-primary" v-if="passwordHasSpecial && passwordReady"><i class="fas fa-lock fa-fw"></i> Your password is super secure</div>
                    <p class="help " :class="{'is-success': passwordLength}"><i class="fas fa-fw" :class="{'fa-check': passwordLength}"></i> Must be eight characters or longer</p>
                    <p class="help " :class="{'is-success': passwordStrength}"><i class="fas fa-fw" :class="{'fa-check': passwordStrength}"></i> Must contain at least 1 numeric character.</p>
                    <p class="help " :class="{'is-success': passwordsMatch}"><i class="fas fa-fw" :class="{'fa-check': passwordsMatch}"></i> Must match confirm password.</p>
                </div>
                <div class="field">
                    <p class="control">
                        <button class="button is-info" :class="{'is-loading': authenticating}" type="button" @click="handleRegister">Register</button>
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
                    <p><router-link to="/login">Already have an account?</router-link></p>
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
    name: 'register',
    components: { SocialAuth },
    data() {
        return {
            email: '',
            password: '',
            confirmPassword:''
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
        passwordsMatch() {
            return this.password.trim() === this.confirmPassword.trim() && this.passwordLength 
        },
        passwordLength() {
            var regex = /(?=.{8,})/
            return regex.test(this.password);
        },
        passwordStrength(){
            var regex = /(?=.*[0-9])/
            return regex.test(this.password);
        },
        passwordHasSpecial(){
            var regex = /(?=.[!@#\$%\^&])/
            return regex.test(this.password);
        },
        passwordReady() {
            return this.passwordsMatch && this.passwordLength && this.passwordStrength
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
            this.confirmPassword = ""
          }
        }
    }
}
</script>