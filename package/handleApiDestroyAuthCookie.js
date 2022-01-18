export async function handleApiDestroyAuthCookie({ request, resolve }) {
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
