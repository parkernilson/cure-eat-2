import { it, describe, expect } from 'vitest'
import { clientToken } from '$lib/tests/mock-data/tokens/tokens.mock'
import { isExpiredNow } from '..'
import { TOKEN_EXPIRATION_BUFFER_MILLIS } from '$lib/constants/auth/tokens'

describe('token isExpired helper', () => {
    it('should return true if the token is expired', () => {
        const expiredToken = {
            ...clientToken,
            expires: "2000-10-29T04:08:43.628Z"
        }

        const result = isExpiredNow(expiredToken)

        expect(result).toBe(true)
    })

    it('should return false if the token is not expired', () => {
        const notExpiredToken = {
            ...clientToken,
            expires: "2200-10-29T04:08:43.628Z"
        }

        expect(isExpiredNow(notExpiredToken)).toBe(false)
    })

    it('should return true if the token is within the expiration buffer', () => {
        const tokenExpiresWithinBuffer = {
            ...clientToken,
            expires: (new Date(Date.now() + TOKEN_EXPIRATION_BUFFER_MILLIS - 1)).toISOString()
        }

        const result = isExpiredNow(tokenExpiresWithinBuffer)

        expect(result).toBe(true)
    })

})