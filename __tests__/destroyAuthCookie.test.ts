import { handleApiDestroyAuthCookie } from '../src/lib/handleApiDestroyAuthCookie';
import { parse } from 'cookie';

async function handleRequest() {
	const request = {
		body: undefined,
		headers: undefined,
		locals: undefined,
		method: 'POST',
		params: undefined,
		rawBody: undefined,
		url: new URL('http://test.local/api/destroyAuthCookie')
	};

	const result = await handleApiDestroyAuthCookie({ request, resolve: undefined });
	return parse(result.headers['Set-Cookie']);
}

describe('destroyAuthCookie', () => {
	test('returns a cookie with the session name and an empty body', async () => {
		const cookie = await handleRequest();
		expect(cookie.session).toBe('{}');
	});

	test('returns a cookie with a Max-Age of 0', async () => {
		const cookie = await handleRequest();
		expect(cookie['Max-Age']).toBe('0');
	});
});
