import { MILLISECONDS_PER_SECONDS } from '$lib/constants/misc/time';
import type { AccessToken } from '$lib/interfaces/tokens/tokens';
import * as E from 'fp-ts/lib/Either';
import PocketBase, { ClientResponseError } from 'pocketbase';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import { getClientContextToken } from '$lib/functions/auth/kroger/get-client-context-token'
import { client_token_record } from '../../../../mock-data/tokens/tokens.mock';
import { unsafeUnwrap } from '$lib/functions/utils/fp';

vi.mock('pocketbase', async () => {
	const actual = await vi.importActual('pocketbase');
	const PocketBaseMock = vi.fn();
	return {
		// @ts-ignore
		ClientResponseError: actual.ClientResponseError,
		default: PocketBaseMock
	};
});

describe('get client context token', async () => {
	const fetchMocker = createFetchMock(vi);
	fetchMocker.enableMocks();

	beforeEach(() => {
		fetchMocker.resetMocks();
	});

	it('should return token if it exists and is not expired', async () => {
		const pb = new PocketBase();
		const clientTokenRecord = {
			...client_token_record,
			expires: '2200-10-29T04:08:43.628Z'
		};
		// @ts-ignore
		vi.mocked(pb).collection = vi.fn().mockReturnValue({
			getFirstListItem: vi.fn().mockResolvedValue(clientTokenRecord)
		});

		const token = await getClientContextToken(pb)();

		expect(token).toMatchObject(E.right(clientTokenRecord));
	});

	it('should renew token if it is expired', async () => {
		const pb = new PocketBase();

		const expiredTokenRecord = {
			...client_token_record,
			expires: '2000-10-29T04:08:43.628Z'
		};

		fetchMocker.mockResponseOnce(
			JSON.stringify({
				access_token: 'new jwt token',
				expires_in: 1800,
				scope: 'product.compact'
			})
		);

		const expectedExpirationDate = new Date(Date.now() + 1800 * MILLISECONDS_PER_SECONDS);

		const updateMocked = vi.fn().mockImplementation((id: string, data: AccessToken) =>
			Promise.resolve({
				...data,
				id,
				created: '2021-10-29T04:08:43.628Z',
				updated: '2021-10-29T04:08:43.628Z',
				collectionId: 'f573cc9d-6430-48ec-b6d6-bddede935162',
				collectionName: 'client_tokens'
			})
		);

		// @ts-ignore
		vi.mocked(pb).collection = vi.fn().mockReturnValue({
			getFirstListItem: vi.fn().mockResolvedValue(expiredTokenRecord),
			update: updateMocked
		});

		const token = await getClientContextToken(pb)();

		expect(token).toMatchObject(
			E.right({
				company: 'kroger',
				access_token: 'new jwt token',
				expires: expect.any(String),
			})
		);

		const tokenInternal = unsafeUnwrap(token)
        expect(tokenInternal.expires).toBeTypeOf('string')
		expect(new Date(tokenInternal.expires) >= expectedExpirationDate).toBe(true);
	});

	it('should request a token if it does not exist', async () => {
        const pb = new PocketBase();

		const createMocked = vi.fn().mockImplementation((data: AccessToken) =>
			Promise.resolve({
				...data,
				id: '7de04593-2991-4447-a911-36662e886c59',
				created: '2021-10-29T04:08:43.628Z',
				updated: '2021-10-29T04:08:43.628Z',
				collectionId: 'f573cc9d-6430-48ec-b6d6-bddede935162',
				collectionName: 'admin_tokens'
			})
		);

        // @ts-ignore
		vi.mocked(pb).collection = vi.fn().mockReturnValue({
			getFirstListItem: vi.fn().mockRejectedValue(new ClientResponseError({ status: 404})),
            create: createMocked
		});

        fetchMocker.mockResponseOnce(
			JSON.stringify({
				access_token: 'new jwt token',
				expires_in: 1800,
				scope: 'product.compact'
			})
		);

        const expectedExpirationDate = new Date(Date.now() + 1800 * MILLISECONDS_PER_SECONDS);

        const token = await getClientContextToken(pb)();
		const tokenInternal = unsafeUnwrap(token);

        expect(tokenInternal).toMatchObject({
            company: 'kroger',
            access_token: 'new jwt token',
			expires: expect.any(String),
        })

        expect(tokenInternal.expires).toBeTypeOf('string')
        expect(new Date(tokenInternal.expires) >= expectedExpirationDate).toBe(true);

    });
});
