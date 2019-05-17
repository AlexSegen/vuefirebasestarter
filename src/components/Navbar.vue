<template>
<nav class="navbar is-transparent">
  <div class="container">
  <div class="navbar-brand">
    <router-link class="navbar-item" to="/">
      <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
    </router-link>
    <div class="navbar-burger burger" data-target="navbarExampleTransparentExample">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>

  <div id="navbarExampleTransparentExample" class="navbar-menu">
    <div class="navbar-start">
      <router-link class="navbar-item" to="/">Home</router-link>
      <router-link class="navbar-item" to="/about">About</router-link>

      <template  v-if="loggedIn">
      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link" href="javascript:void(0);">
          Account
        </a>
        <div class="navbar-dropdown is-boxed">
          <router-link class="navbar-item" to="/profile">
            Profile
          </router-link>
          <hr class="navbar-divider">
          <a class="navbar-item" href="javascript:void(0);" @click="signOut">
            Logout 
          </a>
        </div>
      </div>
      </template>

    </div>

  <template  v-if="!loggedIn">
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="field is-grouped">
          <p class="control">
            <router-link class="bd-tw-button button" to="/login">
              <span class="icon"><i class="fas fa-sign-in-alt"></i></span>
              <span>
                Login
              </span>
            </router-link>
          </p>
          <p class="control">
            <router-link class="button is-primary" to="/register">
              <span class="icon"><i class="fas fa-user-plus"></i></span>
              <span>Register</span>
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </template>
  </div>    
  </div>
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