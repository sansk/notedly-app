// /src/pages/dashboard.js
import NotesService from '../services/notes.js';
import NotesGrid from '../components/NotesGrid.js';
import AuthService from '../services/auth.js';
import UserService from '../services/user.js';
import { router } from '../js/app.js';

const Dashboard = {
    render: async () => {
        // Wait for Firebase Auth to be ready before fetching notes
        const waitForUser = () => new Promise(resolve => {
            const unsub = AuthService.onAuthStateChanged(user => {
                unsub();
                resolve(user);
            });
        });
        const user = await waitForUser();
        let notes = [];
        let userProfile = null;
        if (user) {
            notes = await NotesService.getNotes();
            userProfile = await UserService.getUserProfile(user.uid);
        }
        const displayName = userProfile?.displayName || user?.displayName || '';
        const email = user?.email || '';
        const bio = userProfile?.bio || '';
        const location = userProfile?.location || '';
        const photoURL = userProfile?.photoURL || user?.photoURL || 'https://i.pravatar.cc/100';
        const isGoogleLinked = user?.providerData?.some(p => p.providerId === 'google.com');
        const isPasswordUser = user?.providerData?.some(p => p.providerId === 'password');
        return `
            <div class="bg-gray-100 min-h-screen">
                <!-- Dashboard Header -->
                <header class="bg-white shadow-md">
                    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
                        <h1 class="text-2xl font-bold text-blue-600">Notedly</h1>
                        <div class="w-1/3">
                            <input type="search" placeholder="Search Notes..." class="bg-gray-200 text-gray-700 w-full px-4 py-2 rounded-full focus:outline-none">
                        </div>
                        <div class="flex items-center">
                            <button id="theme-toggle" class="mr-4 text-gray-600 dark:text-gray-300">Dark Mode</button>
                            <div class="relative">
                                <button id="user-menu-button" class="flex items-center focus:outline-none">
                                    <img src="${photoURL}" alt="User" class="w-10 h-10 rounded-full">
                                    <span class="ml-2 font-semibold text-blue-700">${displayName || 'User'}</span>
                                </button>
                                <div id="user-menu-dropdown" class="hidden absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                                    <div class="px-4 py-2 border-b dark:border-gray-700">
                                        <div class="font-bold text-blue-700">${displayName || 'User'}</div>
                                        <div class="text-xs text-gray-500">${email}</div>
                                    </div>
                                    <a href="#" id="edit-profile-btn" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Edit Profile</a>
                                    <a href="#" id="logout-button" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main class="container mx-auto px-6 py-8">
                    <div class="flex justify-between items-center mb-6">
                      <h2 class="text-3xl font-bold">Your Notes</h2>
                      <button id="create-note-btn" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create Note</button>
                    </div>
                    <div id="notes-container">
                        ${NotesGrid.render(notes)}
                    </div>
                </main>

                <!-- Edit Profile Modal -->
                <div id="edit-profile-modal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 hidden">
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
                        ${isPasswordUser ? '' : '<span class="ml-2 text-xs text-gray-400">(Connect email/password to enable)</span>'}
                      </div>
                      <label class="block mb-1 font-semibold">Google Account</label>
                      <div class="flex items-center mb-3">
                        <span class="mr-2">${isGoogleLinked ? 'Connected' : 'Not Connected'}</span>
                        ${isGoogleLinked ? '' : '<button type="button" id="connect-google-btn" class="bg-blue-600 text-white px-2 py-1 rounded text-xs">Connect</button>'}
                      </div>
                      <label class="block mb-1 font-semibold">Short Bio</label>
                      <textarea id="edit-bio" class="w-full px-3 py-2 border rounded mb-3" rows="2" placeholder="Tell us about yourself...">${bio}</textarea>
                      <label class="block mb-1 font-semibold">Location</label>
                      <input type="text" id="edit-location" class="w-full px-3 py-2 border rounded mb-4" value="${location}" placeholder="Your location" />
                      <div class="flex justify-end space-x-2">
                        <button type="button" id="cancel-edit-profile" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
                        <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
                      </div>
                    </form>
                  </div>
                </div>
            </div>
        `;
    },
    after_render: async () => {
        // Theme toggle logic...
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;
        if (localStorage.getItem('theme') === 'dark') {
            html.classList.add('dark');
            themeToggle.textContent = 'Light Mode';
        }
        themeToggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        });

        // The dashboard is now data-driven, so we don't need to re-render notes here.
        // The initial render is handled in the render() method.

        // --- Create Note Button ---
        const createNoteBtn = document.getElementById('create-note-btn');
        createNoteBtn.addEventListener('click', () => {
            router.navigateTo('/editor');
        });

        // --- Notes Grid Event Delegation ---
        const notesContainer = document.getElementById('notes-container');
        notesContainer.addEventListener('click', async (e) => {
            if (e.target.matches('.edit-note-btn')) {
                const noteId = e.target.dataset.id;
                router.navigateTo(`/editor?id=${noteId}`);
            }

            if (e.target.matches('.delete-note-btn')) {
                const noteId = e.target.dataset.id;
                if (confirm('Are you sure you want to delete this note?')) {
                    try {
                        await NotesService.deleteNote(noteId);
                        // Refresh the view
                        const notes = await NotesService.getNotes();
                        notesContainer.innerHTML = NotesGrid.render(notes);
                    } catch (error) {
                        console.error('Failed to delete note:', error);
                        alert('Could not delete the note.');
                    }
                }
            }
        });

        // --- User Menu Dropdown & Profile Management ---
        const userMenuButton = document.getElementById('user-menu-button');
        const userMenuDropdown = document.getElementById('user-menu-dropdown');
        const logoutButton = document.getElementById('logout-button');
        const editProfileBtn = document.getElementById('edit-profile-btn');
        const editProfileModal = document.getElementById('edit-profile-modal');
        const editProfileForm = document.getElementById('edit-profile-form');
        const editDisplayName = document.getElementById('edit-display-name');
        const cancelEditProfile = document.getElementById('cancel-edit-profile');

        userMenuButton.addEventListener('click', () => {
            userMenuDropdown.classList.toggle('hidden');
        });

        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await AuthService.logout();
                router.navigateTo('/');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        });

        // Edit Profile
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                userMenuDropdown.classList.add('hidden');
                router.navigateTo('/edit-profile');
            });
        }
        // (Edit profile modal logic removed; now handled in /edit-profile route)

        // Close dropdown/modal if clicked outside, but not when opening modal
        document.addEventListener('mousedown', (e) => {
            // Dropdown
            if (!userMenuButton.contains(e.target) && !userMenuDropdown.contains(e.target)) {
                userMenuDropdown.classList.add('hidden');
            }
            // Modal: don't close if click is inside modal or on the edit button
            if (
                editProfileModal &&
                !editProfileModal.classList.contains('hidden') &&
                !editProfileModal.contains(e.target) &&
                e.target !== editProfileBtn &&
                !editProfileBtn.contains(e.target)
            ) {
                editProfileModal.classList.add('hidden');
            }
        });
    }
};

export default Dashboard;