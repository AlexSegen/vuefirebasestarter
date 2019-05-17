<template>
    <div class="profile">
        <h1>Profile</h1>
        
        <div v-if="!user.emailVerified" class="alert alert-warning"><strong>Warning:</strong> You need to confirm your email. <br><br> <button type="button" @click="emailVerification">Verify</button> <br><br></div>

        <p><img style="width: 100px; height: 100px; margin: 10px auto; display:block; border-radius: 50%" :src="profile.photoURL" :alt="profile.displayName"></p>
        <input type="name" placeholder="Display name" v-model="profile.displayName"><br>
        <input type="text" placeholder="Photo URL" v-model="profile.photoURL">
        <p><button type="button" @click="updateProfile">Update Profile</button></p>
        <hr>
        <br>
        <h4>Update password</h4>
        <input type="password" placeholder="New password" v-model="newPassword">
        <p><button type="button" @click="updatePassword">Update password</button></p>
    </div>
</template>

<script>
import notification from '@/libs/notifications'
import { mapGetters, mapActions } from "vuex";
import authService from '@/services/auth.service'

export default {
    name: 'profile',
    data() {
        return {
            profile: '',
            newPassword: ''
        }
    },
    computed: {
        ...mapGetters("auth", [
            "user",
            'loading',
            'requestError',
            'requestErrorCode'])
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

<style>
.login{ 
    margin-top: 40px;
}
input {
    margin: 10px 0;
    width: 20%;
    padding: 15px;
}
button {
    width: 10%;
    cursor: pointer;
}

p{
    font-size: 13px;
}

p a {
    text-decoration: underline;
    cursor: pointer;
}

</style>
