<template>
    <div class="login">
        <h1>Sign In</h1>
        <input type="email" placeholder="Email" v-model="email"><br>
        <input type="password" placeholder="password" v-model="password"><br>
        <button @click="handleLogin">Connection</button>
        <p>Don't have an account? <router-link to="/register">Create one</router-link></p>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: 'login',
    data() {
        return {
            email: 'alejandrojv17@gmail.com',
            password: '123456'
        }
    },
  computed: {
      ...mapGetters('auth', [
          'authenticating',
          'authenticationError',
          'authenticationErrorCode'
      ])
  },
  methods: {
      ...mapActions('auth', [
          'login'
      ]),

      handleLogin() {
          if (this.email != '' && this.password != '') {
            this.login({email: this.email, password: this.password})
            this.password = ""
          }
      },
      checkNewUser() {
        return this.$route.query.register == 'success'
      }
  }
}
</script>

<style scoped>
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
