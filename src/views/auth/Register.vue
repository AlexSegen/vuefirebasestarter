<template>
    <div class="sign-up container">
        <div class="card card-auth">
            <div class="card-content ">
                <div class="field">
                    <p>Let's create a new account!</p>
                </div>
                <div class="field">
                <p class="control has-icons-left has-icons-right">
                    <input class="input" type="email" placeholder="Email" v-model="email" :disabled="authenticating">
                    <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                    </span>
                    <span class="icon is-small is-right">
                    <i class="fas fa-check"></i>
                    </span>
                </p>
                </div>
                <div class="field">
                <p class="control has-icons-left">
                    <input class="input" type="password" placeholder="Password" v-model="password" :disabled="authenticating">
                    <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                    </span>
                </p>
                </div>
                <div class="field">
                    <p>Already have an account? <router-link to="/login">Login</router-link></p>
                </div>
                <div class="field">
                    <p class="control">
                        <button class="button is-success" :class="{'is-loading': authenticating}" type="button" @click="handleRegister">Register</button>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    name: 'register',
    data() {
        return {
            email: '',
            password: '',
            authenticating: ''
        }
    },
    methods: {
        handleRegister() {
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(user => {
                alert('Account created!')
                console.log(user)
            }).catch(e => {
                console.log('Error: ' + e.message);
            });
        }
    }
}
</script>