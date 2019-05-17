<template>
    <div class="profile">
       
        <Hero title="Profile" subtitle="Update your personal info" />

        <div class="container" style="margin-top:50px;">
            <div class="columns">
                <div class="column"></div>
                <div class="column">
                        <div class="">
                            <div class="card-content ">

                                <div class="notification is-info"  v-if="!user.emailVerified">
                                    <strong>Important:</strong><br>
                                    <p>We need to verify your identity. </p><br>
                                    <p><button class="button is-default" type="button" @click="emailVerification">Confirm email</button></p>
                                </div>

                                <div class="field">
                                    <h1>Update profile</h1>
                                </div>
                                <div class="field">
                                <p class="control has-icons-left has-icons-right">
                                    <input class="input" type="text" placeholder="Display name" v-model="profile.displayName" >
                                    <span class="icon is-small is-left">
                                    <i class="fas fa-user"></i>
                                    </span>
                                    <span class="icon is-small is-right has-text-success">
                                        <i class="fas fa-check"></i>
                                    </span>
                                </p>
                                </div>
                                <div class="field">
                                <p class="control has-icons-left has-icons-right">
                                    <input class="input" type="text" placeholder="Photo URL" v-model="profile.photoURL">
                                    <span class="icon is-small is-left">
                                    <i class="fas fa-camera"></i>
                                    </span>
                                    <span class="icon is-small is-right has-text-success">
                                        <i class="fas fa-check"></i>
                                    </span>
                                </p>
                                </div>
                                <div class="field">
                                    <p class="control">
                                        <button class="button is-success" type="button" @click="updateProfile">Update profile</button>
                                    </p>
                                </div>

                                <hr>
                                
                                <div class="field">
                                    <h1>Update password</h1>
                                </div>

                                <div class="field">
                                <p class="control has-icons-left has-icons-right">
                                    <input class="input" type="password" placeholder="New password" v-model="newPassword">
                                    <span class="icon is-small is-left">
                                    <i class="fas fa-lock"></i>
                                    </span>
                                    <span class="icon is-small is-right has-text-success" v-if="passwordReady">
                                        <i class="fas fa-check"></i>
                                    </span>
                                </p>
                                </div>

                                <div class="field">
                                <p class="control has-icons-left has-icons-right">
                                    <input class="input" type="password" placeholder="Confirm password" v-model="confirmPassword">
                                    <span class="icon is-small is-left">
                                    <i class="fas fa-lock"></i>
                                    </span>
                                    <span class="icon is-small is-right has-text-success" v-if="passwordReady">
                                        <i class="fas fa-check"></i>
                                    </span>
                                </p>
                                </div>
                                <div class="field">
                                    <p class="control">
                                        <button class="button is-info" type="button" @click="updatePassword" :disabled="!passwordReady">Update password</button>
                                    </p>
                                </div>

                            </div>
                        </div>
                </div>
                <div class="column"></div>
            </div>
        </div>

    </div>
</template>

<script>
import Hero from '@/components/HeroSection.vue'
import notification from '@/libs/notifications'
import { mapGetters, mapActions } from "vuex";
import authService from '@/services/auth.service'


export default {
    name: 'profile',
    components: {
        Hero
    },
    data() {
        return {
            profile: '',
            newPassword: '',
            confirmPassword: '',
        }
    },
    computed: {
        ...mapGetters("auth", [
            "user",
            'loading',
            'requestError',
            'requestErrorCode']),
    passwordReady() {
        return this.newPassword.trim().length > 5 && (this.newPassword.trim() === this.confirmPassword.trim())
    }
    },
    created() {
        this.profile = this.user;
    },
    methods: {
        ...mapActions('auth', ['updateUser', 'verifyEmail']),
        updateProfile() {
            this.updateUser(this.profile);
        },
        emailVerification() {
            this.verifyEmail();
        },
        async updatePassword() {
            try {
                let data = await authService.updatePassword(this.newPassword);
                if(data) {
                    notification.success('Password Updated!')
                    this.newPassword = '';
                    return
                }
                notification.error(error.message)
                
            } catch (error) {
                notification.error(error.message)
            }
        }
    },
}
</script>