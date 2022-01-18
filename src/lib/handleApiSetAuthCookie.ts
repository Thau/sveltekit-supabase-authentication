import type { ServerRequest } from '@sveltejs/kit/types/hooks';
import type { Session } from '@supabase/supabase-js';

interface SessionBody {
	session: Session;
}

export async function handleApiSetAuthCookie({
	request,
	resolve
}: {
	request: ServerRequest;
	resolve: any;
}) {
	const { url, method, body } = request;

	if (url.pathname === '/api/setAuthCookie' && method === 'POST') {
		const { session } = body as unknown as SessionBody;

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
