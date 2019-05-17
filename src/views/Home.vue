<template>
  <div class="home">
    <h1>Welcome, {{ user.displayName ? user.displayName : user.email }}</h1>
    <p>Email: {{ user.email }} - Registered on {{ user.createdAt | formatDate }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
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
