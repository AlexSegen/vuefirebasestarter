<template>
    <div class="login">
        <Hero title="VueFire Starter" subtitle="Vue & Firebase Authentication, CRUD and File Store boilerplate."/>
        <div class="card-auth">
            <div v-if="!send" class="card-content ">
                <div class="field">
                    <h1>Recover password</h1>
                </div>
                <div class="field">
                <p class="control has-icons-left has-icons-right">
                    <input class="input" type="email" placeholder="Email" v-model="email" :disabled="loading">
                    <span class="icon is-left">
                    <i class="fas fa-envelope"></i>
                    </span>
                    <span class="icon is-right has-text-success" v-if="emailReady">
                        <i class="fas fa-check"></i>
                    </span>
                </p>
                </div>
                <div class="field">
                    <p class="control">
                        <button class="button is-success" :class="{'is-loading': loading}" type="button" @click="handleRecover">
                            Send password recovery email
                        </button>
                    </p>
                </div>
            </div>
            <div v-else class="card-content">
                <div class="notification is-primary">
                    <p>Your reset password email has been send. Please, <strong>check your inbox</strong> to recover your account.</p>
                    <p><router-link to="/login">Go back</router-link></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import notification from '@/libs/notifications'
import {firebase, auth} from '@/config/firebase.config'

export default {
    name: 'recoverPassword',
    data() {
        return {
            email: '',
            loading: false,
            send: false
        }
    },
  computed: {
    emailReady() {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(this.email).toLowerCase());
    }
  },
  created() {
  },
  methods: {
      handleRecover() {
          if (this.emailReady) {
                this.loading = true;
            auth.sendPasswordResetEmail(this.email).then(() => {
                this.loading = false;
                this.send = true;
            }).catch(error => {
                this.loading = false;
                //console.log('error', error)
                if(error.code == 'auth/user-not-found') {
                    notification.error("The email you have provided doesn't exist.")
                    return
                }
                notification.error(error.message)
            })
          }
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
