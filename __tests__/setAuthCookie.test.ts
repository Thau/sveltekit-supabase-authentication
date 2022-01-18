import type { ServerRequest } from '@sveltejs/kit/types/hooks';
import { handleApiSetAuthCookie } from '../src/lib/handleApiSetAuthCookie';
import { parse } from 'cookie';

async function handleRequest() {
	const request = {
		body: { session: 'test' },
		headers: undefined,
		locals: undefined,
		method: 'POST',
		params: undefined,
		rawBody: undefined,
		url: new URL('http://test.local/api/setAuthCookie')
	} as unknown as ServerRequest;

	const result = await handleApiSetAuthCookie({ request, resolve: undefined });
	return parse(result.headers['Set-Cookie']);
}

describe('setAuthCookie', () => {
	test('returns a cookie in the headers', async () => {
		const cookie = await handleRequest();
		expect(cookie.session).toBe('test');
	});

	test('the cookie uses Strict SameSite', async () => {
		const cookie = await handleRequest();
		expect(cookie.SameSite).toBe('Strict');
	});

	test('the cookie is valid for the whole application path', async () => {
		const cookie = await handleRequest();
		expect(cookie.Path).toBe('/');
	});
});
