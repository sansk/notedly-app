import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../js/firebase.js';

const storage = getStorage(app);

const StorageService = {
    /**
     * Uploads a file to Firebase Storage and returns the download URL
     * @param {File} file
     * @param {string} userId
     * @returns {Promise<string>} download URL
     */
    async uploadProfilePicture(file, userId) {
        const storageRef = ref(storage, `profile-pictures/${userId}/${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    }
};

export default StorageService;
