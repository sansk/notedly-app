import AuthService from '../services/auth.js';
import UserService from '../services/user.js';
import StorageService from '../services/storage.js';
import { router } from '../js/app.js';

const EditProfile = {
    render: async () => {
        const user = await new Promise(resolve => {
            const unsub = AuthService.onAuthStateChanged(u => { unsub(); resolve(u); });
        });
        if (!user) {
            router.navigateTo('/login');
            return '';
        }
        const userProfile = await UserService.getUserProfile(user.uid);
        const displayName = userProfile?.displayName || user?.displayName || '';
        const email = user?.email || '';
        const bio = userProfile?.bio || '';
        const location = userProfile?.location || '';
        const photoURL = userProfile?.photoURL || user?.photoURL || 'https://i.pravatar.cc/100';
        const isGoogleLinked = user?.providerData?.some(p => p.providerId === 'google.com');
        const isPasswordUser = user?.providerData?.some(p => p.providerId === 'password');
        return `
            <div class="min-h-screen flex items-center justify-center bg-gray-100">
                <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                    <h3 class="text-xl font-bold mb-4">User Management</h3>
                    <form id="edit-profile-form">
                      <div class="flex flex-col items-center mb-4">
                        <img id="edit-profile-pic-preview" src="${photoURL}" alt="Profile Picture" class="w-20 h-20 rounded-full mb-2 object-cover border" />
                        <input type="file" id="edit-profile-pic" accept="image/*" class="mb-2" />
                      </div>
                      <label class="block mb-1 font-semibold">Display Name</label>
                      <input type="text" id="edit-display-name" class="w-full px-3 py-2 border rounded mb-3" value="${displayName}" required />
                      <label class="block mb-1 font-semibold">Email</label>
                      <input type="email" id="edit-email" class="w-full px-3 py-2 border rounded mb-3 bg-gray-100" value="${email}" readonly />
                      <label class="block mb-1 font-semibold">Password</label>
                      <div class="flex mb-3">
                        <input type="password" id="edit-password" class="w-full px-3 py-2 border rounded" placeholder="${isPasswordUser ? 'Change password' : 'Set password'}" ${isPasswordUser ? '' : 'disabled'} />
                        ${isPasswordUser ? '' : '<span class=\"ml-2 text-xs text-gray-400\">(Connect email/password to enable)</span>'}
                      </div>
                      <label class="block mb-1 font-semibold">Google Account</label>
                      <div class="flex items-center mb-3">
                        <span class="mr-2">${isGoogleLinked ? 'Connected' : 'Not Connected'}</span>
                        ${isGoogleLinked ? '' : '<button type=\"button\" id=\"connect-google-btn\" class=\"bg-blue-600 text-white px-2 py-1 rounded text-xs\">Connect</button>'}
                      </div>
                      <label class="block mb-1 font-semibold">Short Bio</label>
                      <textarea id="edit-bio" class="w-full px-3 py-2 border rounded mb-3" rows="2" placeholder="Tell us about yourself...">${bio}</textarea>
                      <label class="block mb-1 font-semibold">Location</label>
                      <input type="text" id="edit-location" class="w-full px-3 py-2 border rounded mb-4" value="${location}" placeholder="Your location" />
                      <div class="flex justify-end space-x-2">
+                        <button type="button" id="cancel-edit-profile" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
+                        <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
                      </div>
                    </form>
                </div>
            </div>
        `;
    },
    after_render: async () => {
        const editProfileForm = document.getElementById('edit-profile-form');
        const cancelEditProfile = document.getElementById('cancel-edit-profile');
        const photoURL = document.getElementById('edit-profile-pic-preview').src;
        let uploadedPicFile = null;
        // Profile picture preview
        const picInput = document.getElementById('edit-profile-pic');
        const picPreview = document.getElementById('edit-profile-pic-preview');
        if (picInput && picPreview) {
            picInput.addEventListener('change', e => {
                const file = e.target.files[0];
                if (file) {
                    uploadedPicFile = file;
                    const reader = new FileReader();
                    reader.onload = ev => {
                        picPreview.src = ev.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        // Save profile
        if (editProfileForm) {
            editProfileForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const newName = document.getElementById('edit-display-name').value.trim();
                const newBio = document.getElementById('edit-bio').value.trim();
                const newLocation = document.getElementById('edit-location').value.trim();
                let newPhotoURL = photoURL;
                try {
                    const user = await new Promise(resolve => {
                        const unsub = AuthService.onAuthStateChanged(u => { unsub(); resolve(u); });
                    });
                    // If a new profile picture is selected, upload to Firebase Storage
                    if (uploadedPicFile) {
                        newPhotoURL = await StorageService.uploadProfilePicture(uploadedPicFile, user.uid);
                    }
                    // Update Firestore profile
                    await UserService.setUserProfile(user.uid, {
                        displayName: newName,
                        bio: newBio,
                        location: newLocation,
                        photoURL: newPhotoURL
                    });
                    // Update password if changed and allowed
                    const newPassword = document.getElementById('edit-password').value;
                    if (newPassword && newPassword.length >= 6 && user.providerData.some(p => p.providerId === 'password')) {
                        await import('firebase/auth').then(({ updatePassword }) => updatePassword(user, newPassword));
                    }
                    // Optionally update Firebase Auth profile
                    await import('firebase/auth').then(({ updateProfile }) => updateProfile(user, { displayName: newName, photoURL: newPhotoURL }));
                    router.navigateTo('/dashboard');
                } catch (err) {
                    alert('Failed to update profile.');
                }
            });
        }
        // Cancel
        if (cancelEditProfile) {
            cancelEditProfile.addEventListener('click', () => {
                if (confirm('Discard changes to your profile?')) {
                    router.navigateTo('/dashboard');
                }
            });
        }
        // Google connect
        const connectGoogleBtn = document.getElementById('connect-google-btn');
        if (connectGoogleBtn) {
            connectGoogleBtn.addEventListener('click', async () => {
                try {
                    const { GoogleAuthProvider, linkWithPopup } = await import('firebase/auth');
                    const user = await new Promise(resolve => {
                        const unsub = AuthService.onAuthStateChanged(u => { unsub(); resolve(u); });
                    });
                    const provider = new GoogleAuthProvider();
                    await linkWithPopup(user, provider);
                    alert('Google account connected!');
                    window.location.reload();
                } catch (err) {
                    alert('Failed to connect Google account.');
                }
            });
        }
    }
};

export default EditProfile;
