import type { ServerRequest } from '@sveltejs/kit/types/hooks';

export async function handleApiDestroyAuthCookie({
	request,
	resolve
}: {
	request: ServerRequest;
	resolve: any;
}) {
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
