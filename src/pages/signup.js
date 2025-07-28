// /src/pages/signup.js
import AuthService from '../services/auth.js';

const Signup = {
    render: () => {
        return `
            <div class="min-h-screen flex items-center justify-center bg-gray-100">
                <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 class="text-2xl font-bold text-center mb-6">Create Your Notedly Account</h2>
                    
                    <!-- Signup Form -->
                    <form id="signup-form">
                        <div class="mb-4">
                            <label for="email" class="block text-gray-700">Email Address</label>
                            <input type="email" id="email" class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" required>
                        </div>
                        <div class="mb-4">
                            <label for="password" class="block text-gray-700">Password</label>
                            <input type="password" id="password" class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" required>
                        </div>
                        <div class="mb-6">
                            <label for="confirm-password" class="block text-gray-700">Confirm Password</label>
                            <input type="password" id="confirm-password" class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" required>
                        </div>
                        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Create Account</button>
                    </form>

                    <div class="text-center my-4">or</div>

                    <!-- Google Sign-In Button -->
                    <button id="google-signin" class="w-full flex items-center justify-center py-2 border rounded-md hover:bg-gray-50">
                        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" class="w-5 h-5 mr-2">
                        <span>Sign up with Google</span>
                    </button>

                    <p class="text-center mt-4">
                        Already have an account? <a href="/login" data-link class="text-blue-600 hover:underline">Log in</a>
                    </p>
                </div>
            </div>
        `;
    },
    after_render: () => {
        const signupForm = document.getElementById('signup-form');
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            const confirmPassword = e.target['confirm-password'].value;

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            try {
                await AuthService.signupWithEmail(email, password);
                // On success, router should redirect to dashboard
            } catch (error) {
                alert(`Signup Failed: ${error.message}`);
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
                googleSignInButton.innerHTML = `<img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" class="w-5 h-5 mr-2"> <span>Sign up with Google</span>`;
            }
        });
    }
};

export default Signup;