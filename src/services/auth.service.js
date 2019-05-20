import firebase from 'firebase'
import {
    TokenService,
    SetUser
} from './storage.service'


class AuthenticationError extends Error {
    constructor(errorCode, message) {
        super(message)
        this.name = this.constructor.name
        this.message = message
        this.errorCode = errorCode
    }
}

const AuthService = {
    /**
     * Login the user and store the access token to TokenService. 
     * 
     * @returns access_token
     * @throws AuthenticationError 
     **/
    login: async function (email, password) {

        try {
            const data = await firebase.auth().signInWithEmailAndPassword(email, password)

            TokenService.saveToken(data.user.ra)
            TokenService.saveRefreshToken(data.user.refreshToken)
            SetUser.saveUser(data.user);
            
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    return user        
                }
            });
            
            //ApiService.setHeader()

            return firebase.auth().currentUser
        } catch (error) {
            throw new AuthenticationError(error.code, error.message)
        }
    },

    /**
     * Register the user and redirects to Login Page. 
     * 
     * @throws AuthenticationError 
     **/
    register: async function (email, password) {

        try {
            const data = await firebase.auth().createUserWithEmailAndPassword(email, password)

            TokenService.saveToken(data.user.ra)
            TokenService.saveRefreshToken(data.user.refreshToken)
            SetUser.saveUser(data.user);
            
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    return user        
                }
            });
            
            return firebase.auth().currentUser

        } catch (error) {
            throw new AuthenticationError(error.code, error.message)
        }
    },

    /**
     * Reauthenticate the user and store the access token to TokenService. 
     * 
     * @returns access_token
     * @throws AuthenticationError 
     **/
    reauthenticate: async function (password) {

        try {
            
            const currentUser = firebase.auth().currentUser;
            const credential = firebase.auth.EmailAuthProvider.credential(
                currentUser.email, 
                password
            );
    
            const data = await currentUser.reauthenticateWithCredential(credential)

            TokenService.saveToken(data.user.ra)
            TokenService.saveRefreshToken(data.user.refreshToken)
            SetUser.saveUser(data.user);
            
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    return user        
                }
            });

            return currentUser

        } catch (error) {
            throw new AuthenticationError(error.code, error.message)
        }
    },

    /**
     * Updates the user and stores to SetUser. 
     * 
     * @returns user
     * @throws AuthenticationError 
     **/
    updateUser: async function (payload) {

        try {
            
            firebase.auth().currentUser.updateProfile(payload);

            SetUser.removeUser();
        
            SetUser.saveUser(payload);

            return payload
            
            
        } catch (error) {
            throw new AuthenticationError(error.code, error.message)
        }
    },

    /**
     * Verifies the user email and stores to SetUser. 
     * 
     * @returns Boolean
     * @throws AuthenticationError 
     **/
    verifyEmail: function () {
        return firebase.auth().currentUser.sendEmailVerification().then(()=>{
            return { success: true}
        }).catch(error => {
            throw new AuthenticationError(error.code, error.message)
        })
    },

    /**
     * Updates the user password. 
     * 
     * @returns message
     * @throws AuthenticationError 
     **/
    updatePassword: function (newPassword) {
        return firebase.auth().currentUser.updatePassword(newPassword).then(()=>{
            return true
        }).catch(error => {
            throw new AuthenticationError(error.code, error.message)
        })
    },


    /**
     * Upload image. 
     * 
     * @returns image url
     * @throws AuthenticationError 
     **/
    updateAvatar: async function (image, userId) {
        const requestData = {
            method: 'post',
            url: "/upload/update-avatar/" + userId,
            data: image
        }

        try {
            const response = await ApiService.customRequest(requestData)

            SetUser.removeUser();
            SetUser.saveUser(response.data.data);
            
            return response.data.data

        } catch (error) {
            throw new AuthenticationError(error.response.status, error.response.data.message)
        }
    },


    /**
     * Recover the user password. Send new password to provided email
     * 
     * @returns message
     * @throws AuthenticationError 
     **/
    recoverPassword: async function (payload) {
        const requestData = {
            method: 'post',
            url: "/auth/reset-password/",
            data: {
                email: payload
            }
        }

        try {
            const response = await ApiService.customRequest(requestData)
            return response.data
        } catch (error) {
            throw new AuthenticationError(error.response.status, error.response.data.message)
        }
    },

    /**
     * Refresh the access token.
     **/
    refreshToken: async function () {
        const refreshToken = TokenService.getRefreshToken()

        const requestData = {
            method: 'post',
            url: "/o/token/",
            data: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            },
            auth: {
                username: process.env.VUE_APP_CLIENT_ID,
                password: process.env.VUE_APP_CLIENT_SECRET
            }
        }

        try {
            const response = await ApiService.customRequest(requestData)

            TokenService.saveToken(response.data.access_token)
            TokenService.saveRefreshToken(response.data.refresh_token)
            // Update the header in ApiService
            ApiService.setHeader()

            return response.data.access_token
        } catch (error) {
            throw new AuthenticationError(error.response.status, error.response.data.detail)
        }

    },

    /**
     * Logout the current user by removing the token from storage. 
     * 
     * Will also remove `Authorization Bearer <token>` header from future requests.
     **/
    logout() {
        // Remove the token and remove Authorization header from Api Service as well 
        TokenService.removeToken()
        TokenService.removeRefreshToken()
        //ApiService.removeHeader()

        SetUser.removeUser();

        firebase.auth().signOut()

    }
}

export default AuthService

export {
    AuthService,
    AuthenticationError
}