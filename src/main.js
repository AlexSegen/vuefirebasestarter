import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'


import firebase from 'firebase'
import firebaseConfig from './config/firebase.config'

Vue.config.productionTip = false



import 'toastmejs/dist/css/toastme.min.css'


let app = '';

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(() => {
  if(!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
