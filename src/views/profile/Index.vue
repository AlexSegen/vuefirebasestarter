<template>
    <div class="profile">
       
        <Hero title="Profile" subtitle="Update your personal info" />

        <div class="container" style="margin-top:50px;">
            <div class="columns">
                <div class="column"></div>
                <div class="column">
                        <div class="">
                            <div class="card-content ">

                                <div class="notification is-default"  v-if="!user.emailVerified">
                                    <strong>Important:</strong><br>
                                    <p>In order to verify your identity, you need to confirm your email.</p>
                                    <br>
                                    <p><button class="button is-warning" :class="{'is-loading': loading}" type="button" @click="emailVerification">Send verification email</button></p>
                                </div>

                                <div class="field">
                                    <h1>Update profile</h1>
                                </div>
                                <div class="field" >
                                    <figure class="image is-128x128" style="margin: 10px auto;">
                                            <img v-if="profile.photoURL" :src="profile.photoURL" class="is-rounded">
                                            <img v-else src="http://placehold.it/128x128" class="is-rounded">
                                    </figure>
                                </div>
                                <div class="field has-text-centered">
                                    <div class="file is-default is-small">
                                        <label class="file-label">
                                        <input class="file-input" type="file" name="resume" @change="onFileChanged" :disabled="uploading">
                                        <span class="file-cta"><span class="file-icon"><i class="fas fa-upload"></i></span> <span class="file-label">Update Avatar</span></span>
                                        </label>
                                    </div>
                                </div>
                                <div class="field">
                                <p class="control has-icons-left has-icons-right">
                                    <input class="input" type="text" placeholder="Display name" v-model="profile.displayName" >
                                    <span class="icon is-small is-left">
                                    <i class="fas fa-user"></i>
                                    </span>
                                    <span class="icon is-small is-right has-text-success" v-if="displayNameReady">
                                        <i class="fas fa-check"></i>
                                    </span>
                                </p>
                                </div>
                                <div class="field">
                                    <p class="control has-icons-left has-icons-right">
                                        <input class="input is-static text-white" type="text" placeholder="Email" v-model="profile.email" readonly>
                                        <span class="icon is-small is-left">
                                        <i class="fas fa-envelope"></i>
                                        </span>
                                    </p>
                                </div>
<!--                                 <div class="field">
                                <p class="control has-icons-left has-icons-right">
                                    <input class="input" type="text" placeholder="Photo URL" v-model="profile.photoURL">
                                    <span class="icon is-small is-left">
                                    <i class="fas fa-camera"></i>
                                    </span>
                                    <span class="icon is-small is-right has-text-success">
                                        <i class="fas fa-check"></i>
                                    </span>
                                </p>
                                </div> -->
                                <div class="field">
                                    <p class="control">
                                        <button class="button is-success" :class="{ 'is-loading': uploading || loading }" type="button" @click="updateProfile">Update profile</button>
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
                                        <button class="button is-info" type="button" @click="updatePassword" :disabled="!passwordReady || loading">Update password</button>
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

import {firebase} from '@/config/firebase.config';

import notification from '@/libs/notifications'
import { mapGetters, mapActions } from "vuex";
import authService from '@/services/auth.service'

export default {
    name: 'profile',
    data() {
        return {
            profile: {},
            newPassword: '',
            confirmPassword: '',
            selectedFile: null,
            uploading: false
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
        },
        displayNameReady(){
            if(this.profile.displayName) return this.profile.displayName.toString().trim().length > 1;
            return false
            
        }
    },
    created() {
        this.profile = this.user;
    },
    methods: {
        ...mapActions('auth', ['updateUser', 'verifyEmail']),
        updateProfile() {
            if(!this.displayNameReady) return notification.error("Display name can't be empty")
            
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
                    this.confirmPassword = '';
                    return
                }
                notification.error(error.message)
                
            } catch (error) {
                notification.error(error.message)
            }
        },
        onFileChanged (event) {
            this.selectedFile = event.target.files[0]
            this.onUpload()
        },
        onUpload() {
            var _this = this;
            _this.uploading = true;
            const uploadTask = firebase.storage().ref().child(`images/${this.selectedFile.name}`).put(this.selectedFile); //create a child directory called images, and place the file inside this directory
            uploadTask.on('state_changed', (snapshot) => {
            }, (error) => {
                _this.uploading = false;
                notification.error(error.message + '. Se console for more details');
                console.log(error);
            }, () => {
                notification.success('File uploaded');
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    _this.profile.photoURL = downloadURL;
                    _this.updateProfile();
                    notification.success('Profile updated!');
                    _this.uploading = false;
                });
            });
            
        }
    },
}
</script>