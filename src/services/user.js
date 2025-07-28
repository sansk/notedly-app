import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../js/firebase.js';

const USERS_COLLECTION = 'users';

const UserService = {
    /**
     * Create or update a user profile in Firestore
     * @param {string} uid
     * @param {object} data
     */
    async setUserProfile(uid, data) {
        await setDoc(doc(db, USERS_COLLECTION, uid), data, { merge: true });
    },

    /**
     * Get a user profile from Firestore
     * @param {string} uid
     * @returns {Promise<object|null>}
     */
    async getUserProfile(uid) {
        const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
        if (userDoc.exists()) {
            return userDoc.data();
        }
        return null;
    },

    /**
     * Update user profile fields
     * @param {string} uid
     * @param {object} data
     */
    async updateUserProfile(uid, data) {
        await updateDoc(doc(db, USERS_COLLECTION, uid), data);
    }
};

export default UserService;
