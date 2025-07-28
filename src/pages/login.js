// /src/pages/login.js
import AuthService from '../services/auth.js';

const Login = {
    render: () => {
        return `
            <div class="min-h-screen flex items-center justify-center bg-gray-100">
                <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 class="text-2xl font-bold text-center mb-6">Login to Notedly</h2>
                    
                    <!-- Email/Password Form -->
                    <form id="login-form">
                        <div class="mb-4">
                            <label for="email" class="block text-gray-700">Email Address</label>
                            <input type="email" id="email" class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" required>
                        </div>
                        <div class="mb-6">
                            <label for="password" class="block text-gray-700">Password</label>
                            <input type="password" id="password" class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" required>
                        </div>
                        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Login</button>
                    </form>

                    <div class="text-center my-4">or</div>

                    <!-- Google Sign-In Button -->
                    <button id="google-signin" class="w-full flex items-center justify-center py-2 border rounded-md hover:bg-gray-50">
                        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" class="w-5 h-5 mr-2">
                        <span>Sign in with Google</span>
                    </button>

                    <p class="text-center mt-4">
                        Don't have an account? <a href="/signup" data-link class="text-blue-600 hover:underline">Sign up</a>
                    </p>
                </div>
            </div>
        `;
    },
    after_render: () => {
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = e.target.email;
            const passwordInput = e.target.password;
            const email = emailInput.value;
            const password = passwordInput.value;
            // Remove any previous error message
            let errorMsg = document.getElementById('login-error-msg');
            if (errorMsg) errorMsg.remove();
            try {
                await AuthService.loginWithEmail(email, password);
                // On success, router should redirect to dashboard
                // This will be handled by the auth state listener
            } catch (error) {
                // Show error message above the form
                const msg = document.createElement('div');
                msg.id = 'login-error-msg';
                msg.className = 'mb-4 text-red-600 text-center font-semibold';
                if (error.code === 'auth/invalid-credential') {
                    msg.textContent = 'Incorrect Email or Password. Try Again!';
                } else if (error.code === 'auth/wrong-password') {
                    msg.textContent = 'Incorrect password. Please try again.';
                } else if (error.code === 'auth/invalid-email') {
                    msg.textContent = 'Invalid email address.';
                } else {
                    msg.textContent = error.message || 'Login failed. Please try again.';
                }
                loginForm.parentNode.insertBefore(msg, loginForm);
                // Clear fields
                emailInput.value = '';
                passwordInput.value = '';
                emailInput.focus();
            }
        });

        const googleSignInButton = document.getElementById('google-signin');
        googleSignInButton.addEventListener('click', async () => {
            googleSignInButton.disabled = true;
            googleSignInButton.innerHTML = `<svg class="animate-spin h-5 w-5 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Signing in...`;
            try {
                await AuthService.loginWithGoogle();
                // On success, router should redirect to dashboard (auth state listener)
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000); // fallback in case listener is slow
            } catch (error) {
                alert(`Google Sign-In Failed: ${error.message}`);
            } finally {
                googleSignInButton.disabled = false;
                googleSignInButton.innerHTML = `<img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" class="w-5 h-5 mr-2"> <span>Sign in with Google</span>`;
            }
        });
    }
};

export default Login;