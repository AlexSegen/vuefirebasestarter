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
          <h2>Welcome<span v-if="user.displayName"> back, {{user.displayName}}</span> <span v-else>, {{user.email}}</span></h2>
          <p v-if="user.lastLoginAt"><strong>Last login:</strong> {{user.lastLoginAt | formatDate}}</p>
          <p v-if="user.emailVerified"><span class="tag is-success">Verified user</span></p>

          <p v-else><span class="tag is-danger">User not verified!</span></p>

        </div>
        <div class="column"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '@/libs/formaters'

export default {
  name:'Home',
  computed: {
    ...mapGetters('auth', ['loggedIn', 'user', 'isAdmin'])
  },
  filters: {
    formatDate(val) {
      return utils.formatFirebaseDateAndTime(val);
    }
  }
}
</script>
