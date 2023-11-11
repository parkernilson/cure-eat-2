import { TOKEN_EXPIRATION_BUFFER_MILLIS } from '$lib/constants/auth/tokens';
import type { AccessToken } from '$lib/interfaces/tokens/tokens';
import { pipe } from 'fp-ts/lib/function';

export const isExpired = (compareDate: Date) => (token: AccessToken) =>
	new Date(
        // use new date here to copy the date, instead of modify the reference
		new Date(compareDate).setMilliseconds(
			compareDate.getMilliseconds() + TOKEN_EXPIRATION_BUFFER_MILLIS
		)
	) >= new Date(token.expires);

export const isExpiredNow = (token: AccessToken) => pipe(token, isExpired(new Date(Date.now())));
