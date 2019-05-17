<template>
    <nav>
        <template  v-if="!loggedIn">
            <li><router-link to="/login">Login</router-link></li>
            <li><router-link to="/register">Register</router-link></li>        
        </template>
        <template  v-else>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/profile">Profile</router-link></li>
        </template>
        <li><router-link to="/about">About</router-link></li>

        <template  v-if="loggedIn">
            <li><a @click="signOut" href="javascript:void(0);">Logout</a></li>
        </template>

    </nav>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters('auth', ['loggedIn', 'user', 'isAdmin']),
  },
  methods: {
    ...mapActions('auth', ['logout']),
    signOut(){
      this.logout();
    }
  }
}
</script>

<style scoped>
nav > li {
    display: inline-block;
    margin-right: 10px;
}
</style>
