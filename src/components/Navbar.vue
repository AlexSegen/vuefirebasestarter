<template>
<nav class="navbar navbar-dark">
  <div class="container">
  <div class="navbar-brand">
    <router-link class="navbar-item" :to="{ name: 'home'}">
      <img src="@/assets/logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
    </router-link>
    <a role="button" class="navbar-burger" @click="toggleNav"  :class="{'is-active': isActive}" data-target="navMenu" aria-label="menu" aria-expanded="false">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div class="navbar-menu" :class="{'is-active': isActive}" id="navMenu">
    <div class="navbar-start">
      <router-link class="navbar-item" :to="{ name: 'home'}">Home</router-link>
      <router-link class="navbar-item" :to="{ name: 'about'}">About</router-link>

      <template  v-if="loggedIn">
        <router-link class="navbar-item" :to="{ name: 'products'}">Products</router-link>

        <div class="navbar-item has-dropdown is-hoverable">
          <router-link class="navbar-link" to="/blog">
            Blog
          </router-link>
          <div class="navbar-dropdown is-boxed">
            <router-link class="navbar-item" :to="{ name: 'createPost'}">Create new post</router-link>
          </div>
        </div>
      </template>

      <router-link v-else class="navbar-item" :to="{ name: 'blog'}"> Blog</router-link>

    </div>


    <div class="navbar-end">
      <div  v-if="loggedIn" class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link" href="javascript:void(0);">
          <img :src="user.photoURL ? user.photoURL : 'https://avatars.dicebear.com/v2/bottts/'+user.email+'.svg?options[colors][]=cyan'" class="image is-24x24 is-rounded" style="margin-right: 5px;"> <template v-if="user.displayName">Hello, {{user.displayName}}</template>  
        </a>
        <div class="navbar-dropdown is-boxed">
          <router-link class="navbar-item" :to="{ name: 'profile'}">Update Profile</router-link>
          <router-link class="navbar-item" :to="{ name: 'updatePassword'}">Update password</router-link>
          <hr class="navbar-divider">
          <a class="navbar-item" href="javascript:void(0);" @click="signOut">
            Logout 
          </a>
        </div>
      </div>

      <div v-else class="navbar-item">
        <div class="field is-grouped">
          <p class="control">
            <router-link class="bd-tw-button button is-primary" :to="{ name: 'login'}">
              <span class="icon"><i class="fas fa-sign-in-alt"></i></span>
              <span>
                Log In
              </span>
            </router-link>
          </p>
          <p class="control">
            <router-link class="button is-info" :to="{ name: 'register'}">
              <span class="icon"><i class="fas fa-user-plus"></i></span>
              <span>Register</span>
            </router-link>
          </p>
        </div>
      </div>
    </div>

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
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
    signOut(){
      this.logout();
    },
    toggleNav() {
      this.isActive = !this.isActive
    }
  }
}
</script>