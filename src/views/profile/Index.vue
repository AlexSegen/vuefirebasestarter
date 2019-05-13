<template>
    <div class="profile">
        <h1>Profile</h1>
        <input type="displayName" placeholder="Name" v-model="displayName"><br>
        <input type="email" placeholder="Email" v-model="email"><br>
        <input type="password" placeholder="password" v-model="password"><br>
        <button>Update</button>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    name: 'profile',
    data() {
        return {
            email: '',
            password: '',
            displayName: ''
        }
    },
    methods: {}
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
    margin-top: 20px;
    width: 10%;
    cursor: pointer;
}

p{
    margin-top: 40px;
    font-size: 13px;
}

p a {
    text-decoration: underline;
    cursor: pointer;
}

</style>
