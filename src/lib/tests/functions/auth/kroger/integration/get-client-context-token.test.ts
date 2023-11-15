import { PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD, PB_TEST_URL, PB_TEST_PORT } from '$env/static/private';
import { KROGER_ACCESS_TOKEN_ENDPOINT } from '$lib/constants/apis/kroger';
import { getClientContextToken } from '$lib/functions/auth/kroger';
import { establishConnection } from '$lib/functions/utils/pocketbase';
import { client_token } from '$lib/tests/mock-data/tokens/tokens.mock';
import * as E from 'fp-ts/lib/Either'
import { execSync } from 'node:child_process';
import PocketBase from 'pocketbase';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

describe('get-client-context-token integration', async () => {
	let adminClient: PocketBase;
	const fetchMocker = createFetchMock(vi);

	beforeEach(async () => {
		fetchMocker.resetMocks();
		fetchMocker.dontMock()

		execSync('npm run start:pb-test');

		adminClient = new PocketBase(`${PB_TEST_URL}:${PB_TEST_PORT}`);

		await establishConnection(adminClient);
		await adminClient.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
	});

	afterEach(async () => {
		execSync('npm run stop:pb-test');
	});

	it('should get a client context token that exists', async () => {
		await adminClient.collection('client_tokens').create(client_token);

		const eitherToken = await getClientContextToken(adminClient)();

        expect(eitherToken).toMatchObject(E.right(client_token))
	});

	it('should request a client context token that does not exist', async () => {
		fetchMocker.enableMocks()
		fetchMocker.mockIf(new RegExp(KROGER_ACCESS_TOKEN_ENDPOINT),
			JSON.stringify({
				access_token: 'new jwt token',
				expires_in: 1800,
				scope: 'product.compact'
			})
		);

		const eitherToken = await getClientContextToken(adminClient)();

		expect(eitherToken).toMatchObject(E.right({
			company: 'kroger',
			access_token: 'new jwt token',
			expires: expect.any(String),
		}));
	});

	it('should renew a client context token that is expired', async () => {
		const expiredToken = {
			...client_token,
			expires: '2000-10-29T04:08:43.628Z'
		};

		await adminClient.collection('client_tokens').create(expiredToken);

		fetchMocker.enableMocks()
		fetchMocker.mockIf(new RegExp(KROGER_ACCESS_TOKEN_ENDPOINT),
			JSON.stringify({
				access_token: 'new jwt token',
				expires_in: 1800,
				scope: 'product.compact'
			})
		);

		const eitherToken = await getClientContextToken(adminClient)();

		expect(eitherToken).toMatchObject(E.right({
			company: 'kroger',
			access_token: 'new jwt token',
			expires: expect.any(String),
		}));
	});
});
