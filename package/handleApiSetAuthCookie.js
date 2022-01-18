export async function handleApiSetAuthCookie({ request, resolve }) {
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
