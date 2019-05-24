import { auth, firebase, database } from '@/config/firebase.config'
import { TokenService, SetUser } from './storage.service'

class AuthenticationError extends Error {
    constructor(errorCode, message) {
        super(message)
        this.name = this.constructor.name
        this.message = message
        this.errorCode = errorCode
    }
}

class PartialProfile {
    constructor() {
        this.gender = ""
        this.dob = ""
        this.company = ""
        this.website = ""
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

            var user = await this.getProfile(data.user);

            TokenService.saveToken(user.token)
            TokenService.saveRefreshToken(user.refreshToken)
            SetUser.saveUser(user);

            return user

        } catch (error) {
            throw new AuthenticationError(error.code, error.message)
        }
    },

        /**
     * Login the user and store the access token to TokenService. 
     * 
     * @returns access_token
     * @throws AuthenticationError 
     **/
    loginSocial: async function () {

        try {
            const provider = new firebase.auth.GoogleAuthProvider();

            const data = await auth.signInWithPopup(provider)

            var user = await this.getProfile(data.user);

            TokenService.saveToken(user.token)
            TokenService.saveRefreshToken(user.refreshToken)
            SetUser.saveUser(user);

            return user

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

            this.createProfile(data.user.uid);

            const user = await this.getProfile(data.user);

            TokenService.saveToken(user.token)
            TokenService.saveRefreshToken(user.refreshToken)
            SetUser.saveUser(user);
            
            return user

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

            var user = await this.getProfile(data.user);

            TokenService.saveToken(user.token)
            TokenService.saveRefreshToken(user.refreshToken)
            SetUser.saveUser(user);

            return user

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
    updateUser: async function (user) {

        try {
            
            auth.currentUser.updateProfile(user);

            database.ref(`users/${user.uid}`).set(user);

            SetUser.removeUser();
        
            SetUser.saveUser(user);

            return user
            
            
        } catch (error) {
            throw new AuthenticationError(error.code, error.message)
        }
    },

        /**
     * Creates partial empty user profile in database
     * 
     * @returns partial empty user profile
     * @throws AuthenticationError 
     **/
    createProfile: async function (uid) {

        try {

            var partialProfile = new PartialProfile();
            
            database.ref(`users/${uid}`).set(partialProfile);

            return partialProfile          
            
        } catch (error) {
            throw new AuthenticationError(error.code, error.message)
        }
    },

    /**
     * Get partial user profile from database
     * 
     * @returns full user profile
     * @throws AuthenticationError 
     **/
    getProfile: async function (user) {

        try {
            
            //Search for user profile extra info in Database
            var partialProfile = await database.ref(`users/${user.uid}`).once('value').then(function(snapshot) {
                return {
                        gender: (snapshot.val() && snapshot.val().gender) || '',
                        dob: (snapshot.val() && snapshot.val().dob) || '',
                        website: (snapshot.val() && snapshot.val().website) || '',
                        company: (snapshot.val() && snapshot.val().company) || ''
                    }
            });
            
            //Merge user basic info + user extra info objects
            var tmpProfile = {...user, ...partialProfile}

            //Mapping user to save it on localstorage.
            var profile = {
                uid: tmpProfile.uid,
                displayName: tmpProfile.displayName,
                email: tmpProfile.email,
                emailVerified: tmpProfile.emailVerified,
                isAnonymous: tmpProfile.isAnonymous,
                phoneNumber: tmpProfile.phoneNumber,
                photoURL: tmpProfile.photoURL,
                token: tmpProfile.ra,
                refreshToken: tmpProfile.refreshToken,
                company: tmpProfile.company,
                dob: tmpProfile.dob,
                gender: tmpProfile.gender,
                website: tmpProfile.website
            }

            return profile
            
            
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