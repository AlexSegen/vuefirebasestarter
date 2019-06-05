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
                                        <span class="icon is-small is-right has-text-success" v-if="oldPasswordLength">
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
                               <div class="field">
                    <div class="tag is-primary" v-if="passwordReady"><i class="fas fa-lock fa-fw"></i> Your password is super secure</div>
                    <p class="help " :class="{'is-success': passwordLength}"><i class="fas fa-fw" :class="{'fa-check': passwordLength}"></i> Must be eight characters or longer</p>
                    <p class="help " :class="{'is-success': passwordHasNumericCharacter}"><i class="fas fa-fw" :class="{'fa-check': passwordHasNumericCharacter}"></i> Must contain at least 1 numeric character.</p>
                    <p class="help " :class="{'is-success': passwordHasAlphabeticalCharacter}"><i class="fas fa-fw" :class="{'fa-check': passwordHasAlphabeticalCharacter}"></i> Must contain at least 1 alphabetic character.</p>
                    <p class="help " :class="{'is-success': passwordHasSpecialCharacter}"><i class="fas fa-fw" :class="{'fa-check': passwordHasSpecialCharacter}"></i> Must contain at least 1 special character.</p>
                    <p class="help " :class="{'is-success': passwordsMatch}"><i class="fas fa-fw" :class="{'fa-check': passwordsMatch}"></i> Must match confirm password.</p>
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

import validate from '@/libs/validations'
import notification from '@/libs/notifications'
import {firebase} from '@/config/firebase.config';
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
        oldPasswordLength() {
            return this.oldPassword.trim().length > 7
        },
        passwordsMatch() {
            return this.newPassword.trim() === this.confirmPassword.trim() && this.passwordLength 
        },
        passwordLength() {
            return validate.password.Length(this.newPassword)
        },
        passwordHasNumericCharacter(){
            return validate.password.HasNumericCharacter(this.newPassword)
        },
        passwordHasAlphabeticalCharacter(){
            return validate.password.HasAlphabeticalCharacter(this.newPassword)
        },
        passwordHasSpecialCharacter(){
            return validate.password.HasSpecialCharacter(this.newPassword)
        },
        passwordReady() {
            return this.passwordsMatch && this.passwordLength && this.passwordHasNumericCharacter
        }
    },
    methods: {
        async updatePassword() {
            if(this.oldPassword.trim().length == 0) return notification.error('Current password is required!');

            this.loading = true;
            try {
                let data = await authService.updatePassword(this.oldPassword,this.newPassword);
                if(data) {
                    notification.success('Password Updated!')
                    this.oldPassword = '';
                    this.confirmPassword = '';
                    this.newPassword = '';
                    this.confirmPassword = '';
                    this.loading = false;
                    return
                }
                this.loading = false;
                this.oldPassword = '';
                notification.error(error.message)
                
            } catch (error) {
                this.loading = false;
                this.oldPassword = '';
                notification.error(error.message)
            }
        }
    }
}
</script>