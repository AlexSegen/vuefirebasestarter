import router from '@/router'
import { Toastme } from 'toastmejs'
import { AuthService, AuthenticationError } from '@/services/auth.service'
import { TokenService, SetUser } from '@/services/storage.service'

const config = { positionY: 'bottom', positionX: 'center', theme: 'dark'};

const alert = new Toastme(config);

const state =  {
    user: SetUser.getUser(),
    isAdmin: false,
    authenticating: false,
    accessToken: TokenService.getToken(),
    authenticationErrorCode: 0,
    authenticationError: '',
    loading: false,
    requestErrorCode: 0,
    requestError: ''
}

const getters = {
    user: state => {
        return state.user
    },
    isAdmin: state => {
        return state.user != null ? state.user.role == 'admin' : false
    },
    loggedIn: (state) => {
        return state.accessToken ? true : false
    },
    token: state => {
        return state.accessToken
    },
    authenticationErrorCode: (state) => {
        return state.authenticationErrorCode
    },

    authenticationError: (state) => {
        return state.authenticationError
    },
    authenticating: (state) => {
        return state.authenticating
    },
    requestErrorCode: (state) => {
        return state.requestErrorCode
    },

    requestError: (state) => {
        return state.requestError
    },
    loading: state => {
        return state.loading
    }
}

const actions = {
    async login({ commit }, {email, password}) {
        
        commit('loginRequest');

        try {
            const user = await AuthService.login(email, password);
            console.log(user);
            commit('loginSuccess', user)
            // Redirect the user to the page he first tried to visit or to the home view
            router.push(router.history.current.query.redirect || '/');

            alert.info('You are connected!');

            return true
        } catch (e) {
            if (e instanceof AuthenticationError) {
                commit('loginError', {errorCode: e.errorCode, errorMessage: e.message})
            }

            alert.error(e.message)

            return false
        }
    },

    async register({ commit },  {email, password}) {
        commit('registerRequest');

        try {
            const data = await AuthService.register(email, password);
            
            commit('registerSuccess', data);

            alert.info('You are connected!');

            router.push('/login?register=success');

            // Redirect the user to the login page
            //router.push('/login?register=success');

            return true
        } catch (e) {
            if (e instanceof AuthenticationError) {
                commit('registerError', {errorCode: e.errorCode, errorMessage: e.message})
            }

            alert.error(e.message)

            return false
        }
    },

    async updateUser({ commit }, payload) {

        commit('updateRequest');
        try {

            const data = await AuthService.updateUser(payload);
            commit('updateSuccess', data)

            alert.success('Profile updated!');

            return true
        } catch (e) {
            if (e instanceof AuthenticationError) {
                commit('updateError', {errorCode: e.errorCode, errorMessage: e.message})
            }

            alert.error(e.message)

            return false
        }
    },

    async verifyEmail({ commit }) {

        commit('emailVerification', true);
        
        try {

            const data = await AuthService.verifyEmail();

            if(data.success) {
                alert.success('Check your email!');
                commit('emailVerification', false);
                return { success: true}
            }

            commit('emailVerification', false);
            alert.error('There was a problem sending your link');
            return false
            
        } catch (e) {
            alert.error(e.message)
            commit('emailVerification', false);
            return false
        }
    },

    logout({ commit }) {
        AuthService.logout()
        commit('logoutSuccess')
        router.push('/login')
        alert.error('You are disconnected')
    }
}

const mutations = {
    loginRequest(state) {
        state.authenticating = true;
        state.authenticationError = ''
        state.authenticationErrorCode = 0
    },

    loginSuccess(state, user) {
        state.accessToken = user.ra
        state.user = user
        state.authenticating = false;
    },

    loginError(state, {errorCode, errorMessage}) {
        state.authenticating = false
        state.authenticationErrorCode = errorCode
        state.authenticationError = errorMessage
    },
    registerRequest(state) {
        state.authenticating = true;
        state.authenticationError = ''
        state.authenticationErrorCode = 0
    },

    registerSuccess(state, user) {
        state.accessToken = user.ra
        state.user = user
        state.authenticating = false;
    },

    registerError(state, {errorCode, errorMessage}) {
        state.authenticating = false
        state.authenticationErrorCode = errorCode
        state.authenticationError = errorMessage
    },
    updateRequest(state) {
        state.loading = true;
    },

    updateSuccess(state, data) {
        state.user = data
        state.loading = false;
    },
    updateError(state, {errorCode, errorMessage}) {
        state.loading = false
        state.requestErrorCode = errorCode
        state.requestError = errorMessage
    },
    emailVerification(state, data) {
        state.loading = data
    },
    logoutSuccess(state) {
        state.accessToken = ''
        state.user = null
    }
}

export const auth = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}