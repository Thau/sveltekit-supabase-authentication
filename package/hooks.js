import { parse } from 'cookie';
import { session } from '$app/stores';
import { sequence } from '@sveltejs/kit/hooks';
import { handleApiSetAuthCookie } from './handleApiSetAuthCookie';
import { handleApiDestroyAuthCookie } from './handleApiDestroyAuthCookie';
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
