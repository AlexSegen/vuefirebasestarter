<template>
  <div class="home">
    <Hero title="VueFirebase" subtitle="This is the home page" />

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
import utils from '@/libs/formaters'
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
      return utils.formatFirebaseDate(val);
    }
  }
}
</script>
