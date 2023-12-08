import { KROGER_LOCATION_SEARCH_ENDPOINT } from '$lib/constants/apis/kroger';
import { getClientContextToken } from '$lib/functions/auth/kroger';
import { responseToJson } from '$lib/functions/utils/fetch';
import type { KrogerStoreLocationResponse } from '$lib/interfaces/locations/kroger/store-locations';
import { toError } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import type Client from 'pocketbase';

interface KrogerLocationQuery {
	zipCode?: string;
}

export const queryLocations =
	(adminClient: Client) =>
	({ zipCode }: KrogerLocationQuery) =>
		pipe(
			getClientContextToken(adminClient),
			TE.flatMap((token) =>
				TE.tryCatch(
					() =>
						fetch(`${KROGER_LOCATION_SEARCH_ENDPOINT}?filter.zipCode.near=${zipCode}`, {
							method: 'GET',
							headers: {
								Accepts: 'application/json',
								Authorization: `Bearer ${token.access_token}`
							}
						}),
					toError
				)
			),
			TE.flatMap(responseToJson<KrogerStoreLocationResponse>)
		);
