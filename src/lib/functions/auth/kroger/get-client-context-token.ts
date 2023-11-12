import { toError } from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as B from 'fp-ts/lib/boolean';
import { pipe } from 'fp-ts/lib/function';
import type Client from 'pocketbase';
import { ClientResponseError } from 'pocketbase';

import { KROGER_SECRET } from '$env/static/private';
import { PUBLIC_KROGER_CLIENT_ID } from '$env/static/public';
import { MILLISECONDS_PER_SECONDS } from '$lib/constants/misc/time';
import { responseToJson } from '$lib/functions/utils/fetch';
import { updateOrCreate } from '$lib/functions/utils/pocketbase';
import { isExpiredNow } from '$lib/functions/utils/tokens';
import type {
	AccessToken,
	AccessTokenModel,
	KrogerAccessTokenResponse
} from '$lib/interfaces/tokens/tokens';

const requestClientAccessToken = (clientId: string, clientSecret: string) =>
	TE.tryCatch(
		() =>
			fetch(`https://api.kroger.com/v1/connect/oauth2/token`, {
				method: 'POST',
				headers: {
					Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					grant_type: 'client_credentials',
					scope: 'product.compact'
				})
			}),
		toError
	);

const saveClientAccessToken = (adminClient: Client) => (token: AccessToken) =>
	updateOrCreate<AccessToken>(adminClient, 'admin_tokens', 'kroger', token);

const renewClientAccessToken = (adminClient: Client) =>
	pipe(
		requestClientAccessToken(PUBLIC_KROGER_CLIENT_ID, KROGER_SECRET),
		TE.flatMap(responseToJson<KrogerAccessTokenResponse>),
		TE.map(
			(data) =>
				<AccessToken>{
					scope: 'product.compact',
					access_token: data.access_token,
					expires: new Date(Date.now() + data.expires_in * MILLISECONDS_PER_SECONDS).toISOString()
				}
		),
		TE.flatMap(saveClientAccessToken(adminClient))
	);

const getNewTokenIfExpired = (adminClient: Client) => (token: AccessToken) =>
	pipe(
		isExpiredNow(token),
		B.fold(
			() => TE.of(token),
			() => renewClientAccessToken(adminClient) as TE.TaskEither<Error, AccessToken>
		)
	);

const getFromDatabase = (adminClient: Client) => 
	TE.tryCatch(() => 
		adminClient
			.collection('admin_tokens')
			.getFirstListItem<AccessTokenModel>("company = 'kroger'"),
		toError
	)

const getExistingToken = (adminClient: Client) =>
	pipe(
		getFromDatabase(adminClient),
		TE.orElse((e) =>
			e instanceof ClientResponseError && e.status === 404
				? renewClientAccessToken(adminClient)
				: TE.left(e)
		)
	);

export const getClientContextToken = (adminClient: Client) =>
	pipe(getExistingToken(adminClient), TE.flatMap(getNewTokenIfExpired(adminClient)));
