/**
 * A simple vanilla JS client-side router.
 * Handles routing by loading page content dynamically.
 */
class Router {
    constructor(routes) {
        this.routes = routes;
        this.init();
    }

    init() {
        window.addEventListener('popstate', () => this.handleRouteChange());
        document.body.addEventListener('click', e => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigateTo(e.target.href);
            }
        });
        this.handleRouteChange();
    }

    navigateTo(url) {
        history.pushState(null, null, url);
        this.handleRouteChange();
    }

    async handleRouteChange() {
        const path = window.location.pathname;
        const url = new URL(window.location.href);
        const queryParams = Object.fromEntries(url.searchParams.entries());

        const route = this.routes.find(r => r.path === path);

        const appRoot = document.getElementById('app');
        if (!appRoot) {
            console.error("Router error: Element with #app ID not found.");
            return;
        }

        if (route) {
            const pageModule = await import(/* @vite-ignore */ `../pages/${route.page}`);
            appRoot.innerHTML = await pageModule.default.render(queryParams);
            if (pageModule.default.after_render) {
                await pageModule.default.after_render(queryParams);
            }
        } else {
            appRoot.innerHTML = `<h1>404 - Page Not Found</h1>`;
        }
    }
}

export default Router;