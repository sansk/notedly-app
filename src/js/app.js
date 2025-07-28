import Router from './router.js';
import AuthService from '../services/auth.js';

// Define the routes for the application
// Each route is an object with a path and the corresponding page module
const routes = [
    { path: '/', page: 'home.js', requiresAuth: false },
    { path: '/dashboard', page: 'dashboard.js', requiresAuth: true },
    { path: '/login', page: 'login.js', requiresAuth: false },
    { path: '/signup', page: 'signup.js', requiresAuth: false },
    { path: '/editor', page: 'editor.js', requiresAuth: true },
];

// Initialize the router with the defined routes
const router = new Router(routes);

// Listen for authentication state changes
AuthService.onAuthStateChanged(user => {
    const currentPath = window.location.pathname;
    const route = routes.find(r => r.path === currentPath);

    if (user) {
        // User is logged in
        if (!route || !route.requiresAuth) {
            // If on a public page like login/signup, redirect to dashboard
            if (currentPath === '/login' || currentPath === '/signup' || currentPath === '/') {
                router.navigateTo('/dashboard');
            }
        }
    } else {
        // User is not logged in
        if (route && route.requiresAuth) {
            // If trying to access a protected page, redirect to login
            router.navigateTo('/login');
        }
    }
});
export { router };