# sveltekit-supabase-authentication

Provides helpers to enable authentication using Supabase in SvelteKit applications, including both SSR and live pages.

## Install

    npm add sveltekit-supabase-authentication

## Usage

The flow of this library is this:

1. We hook on `supabase.auth.onAuthStateChange`. This hook will call make an API call to `/api/setAuthCookie` when a
   successful login happens and another call to `/api/destroyAuthCookie` when a successful logout happens. This is
   automatically handled by the `SupabaseAuthentication` component.
2. We add two SvelteKit hooks, `handleAuth` and `addAuthToSession`.
   - `handleAuth` takes care of several concerns:
     1. Creates the `/api/setAuthCookie` endpoint. This endpoint will be called by `onAuthStateChange` and will just
        return the headers to setup a cookie.
     2. Creates the `/api/destroyAuthCookie` endpoint. This endpoint will be called by `onAuthStateChange` and will
        return the headers to expire the session cookie.

### SupabaseAuthentication

First, we need to wrap our application in a `SupabaseAuthentication` component. The easiest way to do this is in a
layout:

    <script>
    	import SupabaseAuthentication from 'sveltekit-supabase-authentication/SupabaseAuthentication.svelte';
    </script>
    const supabase = INITIALIZED_SUPABASE_CLIENT;
    
    <SupabaseAuthentication {supabase}>
    <slot />
    </SupabaseAuthentication>


### handleAuthCookie and addAuthToSession
There's several ways to install these hooks.

If you don't already have `handle` and `getSession` hooks in your `hooks.js`, the easiest way is to just import these
and export them this way:

    import { handleAuthCookie, addAuthToSession } from 'sveltekit-supabase-authentication';
    const supabase = INITIALIZED_SUPABASE_CLIENT;
    
    export const handle = handleAuthCookie(supabase);
    export const getSession = addAuthToSession;

If you have any of these hooks with other functionality, you can instead compose `handle` using SvelteKit's `sequence`,
like this:

    import { sequence } from '@sveltejs/kit/hooks';
    import { handleAuthCookie } from 'sveltekit-supabase-authentication';
    const supabase = INITIALIZED_SUPABASE_CLIENT;
    
    async function yourOwnHandle({ request, resolve }) {
    console.log('Your Own Handle');
    return await resolve(request);
    }
    
    export const handle = sequence(handleAuthCookie(supabase), yourOwnHandle);

It's important to pass an initialized Supabase client to `handleAuthCookie` so it can check the validity of the token in
the cookie. Otherwise, it would be easy to create a fake cookie.

## authorizeOnLoad

Finally, we need to add a module script to our layout. This will take care of redirecting the user if they try to access
any unauthorized route. We add to our layout file this:

    <script context="module">
    	import { authorizeOnLoad } from 'sveltekit-supabase-authentication';
    	const openPaths = ['/'];
    	const loginPath = '/login';
    
    	export const load = authorizeOnLoad(openPaths, loginPath);
    </script>

`openPaths` allows us to keep public routes that don't require authorization to access.