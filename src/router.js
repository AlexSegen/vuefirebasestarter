import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import { TokenService, SetUser } from '@/services/storage.service'

import Login from './views/auth/Login.vue'
import Register from './views/auth/Register.vue'

import Profile from './views/profile/Index.vue'

import Home from './views/Home.vue'

import Products from './views/products/Index.vue'
import ProductDetails from './views/products/_Id.vue'

import E401 from './views/errors/E401.vue'
import E404 from './views/errors/E404.vue'



const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      name: 'E404',
      component: E404
    },
    {
      path: '/not-authorized',
      name: 'E401',
      component: E401
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        public: true,  // Allow access to even if not logged in
        onlyWhenLoggedOut: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        public: true,  // Allow access to even if not logged in
        onlyWhenLoggedOut: true
      }
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/products',
      name: 'products',
      component: Products
    },
    {
      path: '/products/:id',
      name: 'productDetails',
      component: ProductDetails
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
      meta: {
        public: true
      }
    }
  ]
})

/* router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('login');
  else if (!requiresAuth && currentUser) next('login')
  else next()

}); */


router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some(record => record.meta.public)
  const isAdmin = to.matched.some(record => record.meta.isAdmin)
  const onlyWhenLoggedOut = to.matched.some(record => record.meta.onlyWhenLoggedOut)
  const loggedIn = !!TokenService.getToken();
  const loggedAdmin = SetUser.isAdmin();

  if (!isPublic && !loggedIn) {
    return next({
      path:'/login',
      query: {redirect: to.fullPath}  // Store the full path to redirect the user to after login
    });
  }

  // Do not allow user to visit login page or register page if they are logged in
  if (loggedIn && onlyWhenLoggedOut) {
    return next('/')
  }

  if (loggedIn) {
    if(!loggedAdmin && isAdmin){
      return next({path:'/not-authorized'});
    } else if (loggedAdmin && isAdmin){
      next()
    } else {
      next()
    }
  }

  next();
})


export default router;