// Cleaned up duplicate Home component and export
// /src/pages/home.js

const Home = {
    render: () => {
        // The HTML content for the home page
        return `
            <div class="bg-gray-100">
                <!-- Header -->
                <header class="bg-white shadow">
                    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
                        <h1 class="text-2xl font-bold text-blue-600 cursor-pointer" id="logo-link">Notedly</h1>
                        <nav>
                            <a href="/login" data-link class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</a>
                        </nav>
                    </div>
                </header>

                <!-- Hero Section -->
                <main class="container mx-auto px-6 py-16 text-center">
                    <h2 class="text-4xl font-bold mb-4">The new standard for note-taking</h2>
                    <p class="text-lg text-gray-600 mb-8">Capture your thoughts, organize your work, and express your creativity. All in one place.</p>
                    <a href="/signup" data-link class="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700">Get Started for Free</a>
                </main>

                <!-- Footer -->
                <footer class="bg-white mt-16 py-6">
                    <div class="container mx-auto px-6 text-center text-gray-600">
                        <p>&copy; 2025 Notedly. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        `;
    },
    after_render: () => {
        // Logo click: go to home if not logged in, dashboard if logged in
        const logo = document.getElementById('logo-link');
        if (logo) {
            logo.onclick = async () => {
                // Dynamically import AuthService and router to avoid circular deps
                const [{ default: AuthService }, { router }] = await Promise.all([
                    import('../services/auth.js'),
                    import('../js/app.js')
                ]);
                const user = await new Promise(resolve => {
                    const unsub = AuthService.onAuthStateChanged(u => { unsub(); resolve(u); });
                });
                if (user) {
                    router.navigateTo('/dashboard');
                } else {
                    router.navigateTo('/');
                }
            };
        }
    }
};

export default Home;