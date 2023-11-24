import { KROGER_PRODUCT_SEARCH_ENDPOINT } from '$lib/constants/apis/kroger';
import { getClientContextToken } from '$lib/functions/auth/kroger/get-client-context-token';
import { responseToJson } from '$lib/functions/utils/fetch';
import type { KrogerProductSearchResponse } from '$lib/interfaces/products/kroger/product-search-api';
import { toError } from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import type Client from 'pocketbase';

export const searchKrogerProduct = (adminClient: Client) => (searchTerm: string) =>
	pipe(
		getClientContextToken(adminClient),
		TE.flatMap((token) =>
			TE.tryCatch(
				() =>
					fetch(`${KROGER_PRODUCT_SEARCH_ENDPOINT}?filter.term=${searchTerm}`, {
						method: 'GET',
						headers: {
							Accepts: 'application/json',
							Authorization: `Bearer ${token.access_token}`
						}
					}),
				toError
			)
		),
		TE.flatMap(responseToJson<KrogerProductSearchResponse>)
	);
