import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from "firebase/auth";
import { auth } from '../js/firebase.js';

/**
 * Service class to handle all Firebase Authentication operations.
 */
class AuthService {

    /**
     * Creates a new user with email and password.
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<UserCredential>}
     */
    async signupWithEmail(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential;
        } catch (error) {
            console.error("Error signing up:", error);
            throw error;
        }
    }

    /**
     * Signs in a user with email and password.
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<UserCredential>}
     */
    async loginWithEmail(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential;
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    }

    /**
     * Signs in a user with their Google account.
     * @returns {Promise<UserCredential>}
     */
    async loginWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            return userCredential;
        } catch (error) {
            console.error("Error with Google sign-in:", error);
            throw error;
        }
    }

    /**
     * Signs out the current user.
     * @returns {Promise<void>}
     */
    async logout() {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        }
    }

    /**
     * Checks for the current authentication state.
     * @param {function} callback - A function to call with the user object.
     * @returns {Unsubscribe}
     */
    onAuthStateChanged(callback) {
        return auth.onAuthStateChanged(callback);
    }
}

export default new AuthService();