import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import VueFire from 'vuefire'
Vue.use(VueFire)

import {auth} from './config/firebase.config'

Vue.config.productionTip = false

//Vendors
import 'bulma/css/bulma.css'
import 'toastmejs/dist/css/toastme.min.css'

import './assets/scss/app.scss'


import Editor from '@tinymce/tinymce-vue';
Vue.component('editor', Editor);

//Global components

import HeroSection from './components/HeroSection.vue'

Vue.component('Hero', HeroSection);


//Firebase and Vue Instance
let app = '';
  auth.onAuthStateChanged(() => {
  if(!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})