<template>
  <div class="home">
    <Hero title="Home" subtitle="" />

    <div class="container">
      <div class="columns"  style="margin-top:50px">
        <div class="column"></div>
        <div class="column has-text-centered">
          <figure class="image is-128x128" style="margin: 10px auto;">
                <img :src="user.photoURL" class="is-rounded">
          </figure>
          <h2>Welcome back, {{user.displayName}}</h2>
          <p>Last login: {{user.lastLoginAt}}</p>
        </div>
        <div class="column"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hero from '@/components/HeroSection.vue'

export default {
  name:'Home',
    components: {
        Hero
    },
  computed: {
    ...mapGetters('auth', ['loggedIn', 'user', 'isAdmin'])
  },
  filters: {
    formatDate(val) {
      return new Date(val).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    }
  }
}
</script>
