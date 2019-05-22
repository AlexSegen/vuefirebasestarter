<template>
    <div class="profile">
       
        <Hero title="Security" subtitle="Update your password" />

        <div class="container" style="margin-top:50px;">
            <div class="columns">
                <div class="column"></div>
                <div class="column">
                        <div class="">
                            <div class="card-content ">                               
                                <div class="field">
                                    <h1>Current password</h1>
                                </div>

                                <div class="field">
                                    <p class="control has-icons-left has-icons-right">
                                        <input class="input" type="password" placeholder="Current password" v-model="oldPassword">
                                        <span class="icon is-small is-left">
                                        <i class="fas fa-lock"></i>
                                        </span>
                                        <span class="icon is-small is-right has-text-success" v-if="passwordReady">
                                            <i class="fas fa-check"></i>
                                        </span>
                                    </p>
                                </div>

                                <hr>

                                <div class="field">
                                    <h1>New password</h1>
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
                               <div class="field" v-if="passwordLength">
                                    <p class="help is-danger">New password and confirm password doesn't match.</p>
                                </div>
                                <div class="field">
                                    <p class="control">
                                        <button class="button is-info" :class="{'is-loading': loading}" type="button" @click="updatePassword" :disabled="!passwordReady || loading">Update password</button>
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
import authService from '@/services/auth.service'

export default {
    name: 'updatePassword',
    data() {
        return {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            loading: false
        }
    },
    computed: {
        passwordReady() {
            return this.oldPassword.trim().length > 5 && this.newPassword.trim().length > 5 && (this.newPassword.trim() === this.confirmPassword.trim())
        },
        passwordLength() {
            return this.newPassword.trim().length > 5 && (this.newPassword.trim() !== this.confirmPassword.trim())
        }
    },
    methods: {
        async updatePassword() {
            this.loading = true;
            try {
                let data = await authService.updatePassword(this.oldPassword,this.newPassword);
                if(data) {
                    notification.success('Password Updated!')
                    this.newPassword = '';
                    this.confirmPassword = '';
                    this.loading = false;
                    return
                }
                this.loading = false;
                notification.error(error.message)
                
            } catch (error) {
                this.loading = false;
                notification.error(error.message)
            }
        }
    }
}
</script>