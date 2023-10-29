import { describe, vi, it, beforeEach, expect } from 'vitest'
import createFetchMock from 'vitest-fetch-mock';
import PocketBase from 'pocketbase'
import * as E from 'fp-ts/lib/Either'
import { clientTokenRecord } from '../../../../tests/mock-data/tokens/tokens.mock';
import { getClientContextToken } from '..';


vi.mock('pocketbase', async () => {
	const actual = await vi.importActual('pocketbase')
    const PocketBaseMock = vi.fn()
    return {
		// @ts-ignore
		ClientResponseError: actual.ClientResponseError,
		default: PocketBaseMock
	}
})

describe('get client context token', async () => {

    const fetchMocker = createFetchMock(vi);
    fetchMocker.enableMocks();

    beforeEach(() => {
        fetchMocker.resetMocks()
    })

    it('should return token if it exists and is not expired', async () => {
        const pb = new PocketBase()
        const dbToken = {
            ...clientTokenRecord,
            expires: "2200-10-29T04:08:43.628Z"
        } 
        // @ts-ignore
        vi.mocked(pb).collection = vi.fn().mockReturnValue({ 
            getFirstListItem: vi.fn().mockResolvedValue(dbToken)
        })
        
        const token = await getClientContextToken(pb)()

        expect(token).toMatchObject(E.right(dbToken))
        
    })

    it('should renew token if it is expired', async () => {
        const pb = new PocketBase()
        const dbToken = {
            ...clientTokenRecord,
            expires: "2000-10-29T04:08:43.628Z"
        } 
        // @ts-ignore
        vi.mocked(pb).collection = vi.fn().mockReturnValue({ 
            getFirstListItem: vi.fn().mockResolvedValue(dbToken)
        })

        fetchMocker.mockResponseOnce(JSON.stringify({ 
            access_token: "new jwt token",
            expires_in: 1800,
            scope: "product.compact"
        }))

        const token = await getClientContextToken(pb)()

        expect(token).toMatchObject(E.right({
            access_token: "new jwt token",
        }))

    })

    it.todo('should request a token if it does not exist', async () => {

    })

})