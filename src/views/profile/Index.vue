<template>
    <div class="profile">
       
        <Hero title="Profile" subtitle="Update your personal info" />

        <div class="container" style="margin-top:50px;">
            <div class="columns">
                <div class="column"></div>
                <div class="column">
                        <div class="">
                            <div class="card-content ">

                                <div class="notification bg-primary"  v-if="!user.emailVerified">
                                    <strong>Important:</strong><br>
                                    <p>In order to verify your identity, you need to confirm your email.</p>
                                    <br>
                                    <p><button class="button is-warning" :class="{'is-loading': loading}" type="button" @click="emailVerification">Send verification link</button></p>
                                </div>

                                <div class="field">
                                    <h1>Update profile</h1>
                                </div>
                                <div class="field" >
                                    <figure class="image is-128x128" style="margin: 10px auto;">
                                        <img v-if="profile.photoURL" :src="profile.photoURL" class="is-rounded">
                                        <img v-else :src="'https://avatars.dicebear.com/v2/bottts/'+profile.email+'.svg?options[colors][]=cyan'" class="is-rounded">
                                    </figure>
                                </div>
                                <div class="field">
                                    <div class="file is-default is-small">
                                        <label class="file-label">
                                        <input class="file-input" type="file" name="resume" @change="onFileChanged" :disabled="uploading" accept="image/x-png,image/jpeg" />
                                        <span class="file-cta"><span class="file-icon"><i class="fas " :class="uploading ? 'fa-spinner fa-spin':'fa-upload'"></i></span> <span class="file-label">Update Avatar</span></span>
                                        </label>
                                    </div>
                                </div>
                                <div class="field">
                                    <p class="control has-icons-left has-icons-right">
                                        <input class="input is-static text-white" type="text" placeholder="Email" v-model="profile.email" readonly>
                                        <span class="icon is-small is-left">
                                        <i class="fas fa-envelope"></i>
                                        </span>
                                    </p>
                                </div>
                                <div class="field">
                                    <div class="control has-icons-left has-icons-right">
                                        <input class="input" type="text" placeholder="Display name" v-model="profile.displayName" >
                                        <span class="icon is-small is-left">
                                        <i class="fas fa-user"></i>
                                        </span>
                                        <span class="icon is-small is-right has-text-success" v-if="displayNameReady">
                                            <i class="fas fa-check"></i>
                                        </span>
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label">Gender</label>
                                    <div class="control">
                                        <div class="select">
                                        <select v-model="profile.gender">
                                            <option value="">Undefined</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label">Birthay</label>
                                    <div class="control">
                                        <input class="input" type="date" v-model="profile.dob">
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label">Website</label>
                                    <div class="control">
                                        <input class="input" type="text" placeholder="Your personal or business website" v-model="profile.website">
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label">Company</label>
                                    <div class="control">
                                        <input class="input" type="text" placeholder="Your company name" v-model="profile.company">
                                    </div>
                                </div>
                                <div class="field">
                                    <p class="control">
                                        <button class="button is-success" :class="{ 'is-loading': uploading || loading }" type="button" @click="updateProfile">Update profile</button>
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
        onFileChanged (event) {
            
            try {
                
                const file = event.target.files[0];

                if(file.type == 'image/png' || file.type == 'image/jpeg') {
                    if(file.size < 2000000) {
                    this.selectedFile = file;
                    this.onUpload()
                    } else {
                        notification.error('This file is too large. Your avatar must be 2MB max. ');
                    }
                } else {
                    notification.error('Hey! Only PNG or JPEG files are allowed.');
                }
                
            } catch (error) {
                return false
            }

        },
        onUpload() {
            var _this = this;
            _this.uploading = true;
            const uploadTask = firebase.storage().ref().child(`images/${this.selectedFile.name}`).put(this.selectedFile); //create a child directory called images, and place the file inside this directory
            uploadTask.on('state_changed', (snapshot) => {
            }, (error) => {
                _this.uploading = false;
                notification.error(error.message + '. See console for more details');
                console.log(error);
            }, () => {
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