import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import {
  TokenService,
  SetUser
} from '@/services/storage.service'

import {
  auth
} from './config/firebase.config'

import store from './store'

import Login from './views/auth/Login.vue'
import Register from './views/auth/Register.vue'
import RecoverPassword from './views/auth/RecoverPassword.vue'

import Profile from './views/profile/Index.vue'
import UpdatePassword from './views/profile/UpdatePassword.vue'

import Home from './views/Home.vue'

import Products from './views/products/Index.vue'
import ProductDetails from './views/products/_Id.vue'

import Blog from './views/blog/Index.vue'
import CreatePost from './views/blog/Create.vue'
import EditPost from './views/blog/EditPost.vue'
import PostDetails from './views/blog/_Id.vue'

import E401 from './views/errors/E401.vue'
import E404 from './views/errors/E404.vue'



const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
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
        public: true, // Allow access to even if not logged in
        onlyWhenLoggedOut: true
      }
    },
    {
      path: '/recover-password',
      name: 'recoverPassword',
      component: RecoverPassword,
      meta: {
        public: true, // Allow access to even if not logged in
        onlyWhenLoggedOut: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        public: true, // Allow access to even if not logged in
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
      path: '/blog',
      name: 'blog',
      component: Blog,
      meta: {
        public: true
      }
    },
    {
      path: '/blog/create',
      name: 'createPost',
      component: CreatePost
    },
    {
      path: '/blog/:slug-:id',
      name: 'postDetails',
      component: PostDetails,
      meta: {
        public: true
      }
    },
    {
      path: '/blog/edit/:id',
      name: 'editPost',
      component: EditPost
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/update-password',
      name: 'updatePassword',
      component: UpdatePassword
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import( /* webpackChunkName: "about" */ './views/About.vue'),
      meta: {
        public: true
      }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const isPublic = to.matched.some(record => record.meta.public)
  const isAdmin = to.matched.some(record => record.meta.isAdmin)
  const onlyWhenLoggedOut = to.matched.some(record => record.meta.onlyWhenLoggedOut)
  const loggedIn = !!TokenService.getToken();
  const loggedAdmin = SetUser.isAdmin();

  auth.onAuthStateChanged(user => {
    if (user) {
      TokenService.saveToken(user.ra)
    } else {
      TokenService.removeToken()
    }
  });

  if (!isPublic && !loggedIn) {
    return next({
      path: '/login',
      query: {
        redirect: to.fullPath
      } // Store the full path to redirect the user to after login
    });
  }

  // Do not allow user to visit login page or register page if they are logged in
  if (loggedIn && onlyWhenLoggedOut) {
    return next('/')
  }

  if (loggedIn) {
    if (!loggedAdmin && isAdmin) {
      return next({
        path: '/not-authorized'
      });
    } else if (loggedAdmin && isAdmin) {
      next()
    } else {
      next()
    }
  }

  next();
})


export default router;