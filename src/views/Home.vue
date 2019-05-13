<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1>Welcome</h1>
    <p>You can now <a href="javascript:void(0);" @click="handleSignOut">Sign Out</a></p>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from 'firebase'

export default {
  name: 'home',
  methods: {
    handleSignOut() {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login');
      })
    }
  }
}
</script>
