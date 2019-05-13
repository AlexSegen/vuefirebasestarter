<template>
    <div class="sign-up">
        <p>Let's create a new account!</p>
        <input type="email" placeholder="Email" v-model="email"><br>
        <input type="password" placeholder="password" v-model="password"><br>
        <button @click="handleRegister">Connection</button>
        <p>Already have an account? <router-link to="/login">Login</router-link></p>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    name: 'register',
    data() {
        return {
            email: '',
            password: ''
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

<style>

</style>
