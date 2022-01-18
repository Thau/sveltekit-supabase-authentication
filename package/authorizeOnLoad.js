export function authorizeOnLoad(openPaths, loginPath) {
    return async function ({ url, session }) {
        openPaths.push(loginPath);
        const loggedIn = session.authenticated;
        if (loggedIn && url.pathname === loginPath) {
            // If we're already logged in, just go back.
            return { status: 302, redirect: '/' };
        }
        else if (loggedIn || openPaths.indexOf(url.pathname) > -1) {
            // Even if we're not logged in, if the URL path belongs to the open list,
            // we allow access
            return {};
        }
        else {
            // Otherwise, we redirect to login
            return { status: 302, redirect: loginPath };
        }
    };
}
