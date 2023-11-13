import { PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD, PB_DEV_PORT, PB_DEV_URL } from '$env/static/private';
import { getClientContextToken } from '$lib/functions/auth/kroger';
import { establishConnection } from '$lib/functions/utils/pocketbase';
import { client_token } from '$lib/tests/mock-data/tokens/tokens.mock';
import { unsafeUnwrap } from 'fp-ts-std/Either';
import * as E from 'fp-ts/lib/Either'
import { isRight } from 'fp-ts/lib/Either';
import { execSync } from 'node:child_process';
import PocketBase from 'pocketbase';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

describe('get-client-context-token integration', async () => {
	let adminClient: PocketBase;
	const fetchMocker = createFetchMock(vi);
	fetchMocker.enableMocks();

	beforeEach(async () => {
		execSync('npm run start:pb-test');

		adminClient = new PocketBase(`${PB_DEV_URL}:${PB_DEV_PORT}`);

		await establishConnection(adminClient);
		await adminClient.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);

		fetchMocker.resetMocks();
	});

	afterEach(async () => {
		execSync('npm run stop:pb-test');
	});

	it('should get a client context token that exists', async () => {
		await adminClient.collection('admin_tokens').create(client_token);

		const eitherToken = await getClientContextToken(adminClient)();

        expect(eitherToken).toMatchObject(E.right(client_token))
	});

	it('should request a client context token that does not exist', async () => {
		fetchMocker.mockResponseOnce(
			JSON.stringify({
				access_token: 'new jwt token',
				expires_in: 1800,
				scope: 'product.compact'
			})
		);

		// 1800 seconds (in milliseconds) from now
		const expectedExpiresInMilliseconds = 1800 * 1000 + Date.now();

		const eitherToken = await getClientContextToken(adminClient)();

		expect(eitherToken).toMatchObject(E.right({
			id: 'kroger',
			access_token: 'new jwt token',
			expires: expect.any(String),
			scope: 'product.compact'
		}));

        const token = unsafeUnwrap(eitherToken);

		const actualExpiresInMilliseconds = new Date(token.expires).getUTCMilliseconds();
		expect(actualExpiresInMilliseconds).toBeCloseTo(expectedExpiresInMilliseconds);
	});

	it('should renew a client context token that is expired', async () => {
		const expiredToken = {
			...client_token,
			expires: '2000-10-29T04:08:43.628Z'
		};

		await adminClient.collection('admin_tokens').create(expiredToken);

		fetchMocker.mockResponseOnce(
			JSON.stringify({
				access_token: 'new jwt token',
				expires_in: 1800,
				scope: 'product.compact'
			})
		);

		// 1800 seconds (in milliseconds) from now
		const expectedExpiresInMilliseconds = 1800 * 1000 + Date.now();

		const eitherToken = await getClientContextToken(adminClient)();
		expect(isRight(eitherToken)).toBe(true);

		const token = unsafeUnwrap(eitherToken);
		expect(token).toMatchObject({
			company: 'kroger',
			access_token: 'new jwt token',
			expires: expect.any(String),
			scope: 'product.compact'
		});

		const actualExpiresInMilliseconds = new Date(token.expires).getUTCMilliseconds();
		expect(actualExpiresInMilliseconds).toBeCloseTo(expectedExpiresInMilliseconds);
	});
});
