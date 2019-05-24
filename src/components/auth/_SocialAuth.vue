<template>
    <div class="field">
        <button class="button is-danger" :class="{'is-loading': authenticating}" type="button" @click="handleGoogleLogin"><i class="fab fa-google fa-fw"></i> Connect with Google</button>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {firebase, auth} from '@/config/firebase.config'

export default {
    name: 'SocialAuth',
    computed: {
    ...mapGetters('auth', [
        'authenticating',
        'authenticationError',
        'authenticationErrorCode'
    ])
    },
    methods: {
        ...mapActions('auth', ['loginSocial']),
        handleGoogleLogin() {
          this.loginSocial();
        }
    }
}
</script>

<style>

</style>
