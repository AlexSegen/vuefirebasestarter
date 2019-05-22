import { auth, firebase } from '@/config/firebase.config'
import { TokenService, SetUser } from './storage.service'

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
            const data = await auth.signInWithEmailAndPassword(email, password)

            TokenService.saveToken(data.user.ra)
            TokenService.saveRefreshToken(data.user.refreshToken)
            SetUser.saveUser(data.user);
/* 
            auth.onAuthStateChanged(function(user) {
                if (user) {
                    
                    console.log(user)

                    var authenticatedUser = {
                        displayName: user.displayName,
                        email: user.email,
                        emailVerified: user.emailVerified,
                        photoURL: user.photoURL,
                        isAnonymous: user.isAnonymous,
                        uid: user.uid,
                        providerData: user.providerData
                    }

                    

                    return authenticatedUser
                }
            });
 */
            return data.user

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
            const data = await auth.createUserWithEmailAndPassword(email, password)

            TokenService.saveToken(data.user.ra)
            TokenService.saveRefreshToken(data.user.refreshToken)
            SetUser.saveUser(data.user);
            
            auth.onAuthStateChanged(function(user) {
                if (user) {
                    return user        
                }
            });
            
            return auth.currentUser

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
            
            const currentUser = auth.currentUser;
            const credential = firebase.auth.EmailAuthProvider.credential(
                currentUser.email, 
                password
            );
    
            const data = await currentUser.reauthenticateWithCredential(credential)

            TokenService.saveToken(data.user.ra)
            TokenService.saveRefreshToken(data.user.refreshToken)
            SetUser.saveUser(data.user);
            
            auth.onAuthStateChanged(function(user) {
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
            
            auth.currentUser.updateProfile(payload);

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
        try {
            auth.currentUser.sendEmailVerification();
            
            return { success: true}

        } catch (error) {
            throw new AuthenticationError(error.code, error.message)
        }
    },

    /**
     * Updates the user password. 
     * 
     * @returns message
     * @throws AuthenticationError 
     **/
    updatePassword: async function (oldPassword, newPassword) {

        if(!oldPassword) throw ('Old password is required!');

        try {
            
            let data = await this.reauthenticate(oldPassword);

            if(data){

                try {
                    auth.currentUser.updatePassword(newPassword);
                    return true
                } catch (error) {
                    throw new AuthenticationError(error.code, error.message)
                }
 
            }

        } catch (error) {
            
            throw new AuthenticationError(error.code, error.message)
        
        }

    },
     /**
     * Recover the user password. Send new password to provided email
     * 
     * @returns message
     * @throws AuthenticationError 
     **/
    recoverPassword: async function (payload) {
        try {
            
        } catch (error) {
            throw new AuthenticationError(error.response.status, error.response.data.message)
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

        auth.signOut()

    }
}

export default AuthService

export {
    AuthService,
    AuthenticationError
}