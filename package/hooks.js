import { parse } from 'cookie';
import { session } from '$app/stores';
import { sequence } from '@sveltejs/kit/hooks';
async function handleApiSetAuthCookie({ request, resolve }) {
    const { url, method, body } = request;
    if (url.pathname === '/api/setAuthCookie' && method === 'POST') {
        const { session } = body;
        return {
            status: 200,
            headers: {
                'Set-Cookie': `session=${JSON.stringify(session)};SameSite=Strict;Path=/`
            }
        };
    }
    const response = await resolve(request);
    return {
        ...response,
        headers: {
            ...response.headers
        }
    };
}
async function handleApiDestroyAuthCookie({ request, resolve }) {
    const { url, method } = request;
    if (url.pathname === '/api/destroyAuthCookie' && method === 'POST') {
        return {
            status: 200,
            headers: {
                'Set-Cookie': `session="{}";Max-Age=0;SameSite=Strict;Path=/`
            }
        };
    }
    const response = await resolve(request);
    return {
        ...response,
        headers: {
            ...response.headers
        }
    };
}
function handleAuthCookie(supabase) {
    return async function ({ request, resolve }) {
        // Parse available cookies
        const cookies = parse(request.headers.cookie || '');
        if (cookies.session) {
            // If there's a session cookie, we expect it to be a Supabase session in JSON
            const session_cookie = JSON.parse(cookies.session);
            // Verify against the Supabase server, because otherwise any cookie with the same structure would be a valid
            // login
            const { user } = await supabase.auth.api.getUser(session_cookie.access_token);
            if (user) {
                request.locals.user = session_cookie.user;
                request.locals.access_token = session_cookie.access_token;
                request.locals.authenticated = !!session_cookie.access_token;
            }
        }
        const response = await resolve(request);
        return {
            ...response,
            headers: {
                ...response.headers
            }
        };
    };
}
export function handleAuth(supabase) {
    return sequence(handleApiSetAuthCookie, handleApiDestroyAuthCookie, handleAuthCookie(supabase));
}
export function addAuthToSession(request) {
    const user = request.locals.user;
    const access_token = request.locals.access_token;
    const authenticated = request.locals.authenticated;
    return { user, access_token, authenticated };
}
export async function onAuthStateChange(event, sb_session) {
    if (event !== 'SIGNED_OUT') {
        await fetch('/api/setAuthCookie', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'same-origin',
            body: JSON.stringify({ session: sb_session })
        });
        session.set({
            user: sb_session.user,
            access_token: sb_session.access_token,
            authenticated: true
        });
    }
    else {
        await fetch('/api/destroyAuthCookie', {
            method: 'POST',
            credentials: 'same-origin'
        });
        session.set({});
    }
}
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
