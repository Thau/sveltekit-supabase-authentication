import { authorizeOnLoad } from '../src/lib/authorizeOnLoad';

describe('authorizeOnLoad', () => {
	test('when unauthorized, redirects to the login path', async () => {
		const request = {
			url: new URL('http://test.com/unauthorized'),
			session: {
				authenticated: false
			}
		};
		const result = await authorizeOnLoad([], '/login')(request);

		expect(result).toEqual({ status: 302, redirect: '/login' });
	});

	test('when authorized, we allow access', async () => {
		const request = {
			url: new URL('http://test.com/unauthorized'),
			session: {
				authenticated: true
			}
		};
		const result = await authorizeOnLoad([], '/login')(request);

		expect(result).toEqual({});
	});

	test('open paths are always accessible', async () => {
		const request = {
			url: new URL('http://test.com/open'),
			session: {
				authenticated: false
			}
		};
		const result = await authorizeOnLoad(['/open'], '/login')(request);

		expect(result).toEqual({});
	});

	test('when authorized, going to the login path redirects to root', async () => {
		const request = {
			url: new URL('http://test.com/login'),
			session: {
				authenticated: true
			}
		};
		const result = await authorizeOnLoad([], '/login')(request);

		expect(result).toEqual({ status: 302, redirect: '/' });
	});
});
