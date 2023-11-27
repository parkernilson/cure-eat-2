import { toError } from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as B from 'fp-ts/lib/boolean';
import { pipe } from 'fp-ts/lib/function';
import type Client from 'pocketbase';
import { ClientResponseError } from 'pocketbase';

import { env as env_secret } from '$env/dynamic/private';
import { env as env_public } from '$env/dynamic/public';
import { MILLISECONDS_PER_SECONDS } from '$lib/constants/misc/time';
import { responseToJson } from '$lib/functions/utils/fetch';
import { isExpiredNow } from '$lib/functions/utils/tokens';
import type {
	AccessToken,
	AccessTokenRecordModel,
	KrogerAccessTokenResponse
} from '$lib/interfaces/tokens/tokens';
import { KROGER_ACCESS_TOKEN_ENDPOINT } from '$lib/constants/apis/kroger';

const requestClientAccessToken = (clientId: string, clientSecret: string) =>
	pipe(
		TE.tryCatch(
			() =>
				fetch(KROGER_ACCESS_TOKEN_ENDPOINT, {
					method: 'POST',
					headers: {
						Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: new URLSearchParams({
						grant_type: 'client_credentials',
						scope: 'product.compact'
					})
				}),
			toError
		),
		TE.flatMap((response) =>
			response.ok
				? TE.right(response)
				: TE.left(new Error(`Received error response ${response.status} ${response.statusText}`))
		),
		TE.flatMap(responseToJson<KrogerAccessTokenResponse>)
	);

const updateExistingToken =
	(adminClient: Client) => (newToken: AccessToken) => (existingToken: AccessTokenRecordModel) =>
		TE.tryCatch(
			() =>
				adminClient
					.collection('client_tokens')
					.update<AccessTokenRecordModel>(existingToken.id, newToken),
			toError
		);

const createNewTokenIfNotFound = (adminClient: Client) => (newToken: AccessToken) => (e: unknown) =>
	pipe(
		e instanceof ClientResponseError && e.status === 404,
		B.fold<TE.TaskEither<Error, AccessTokenRecordModel>>(
			() => TE.left(toError(e)),
			() =>
				TE.tryCatch(
					() => adminClient.collection('client_tokens').create<AccessTokenRecordModel>(newToken),
					toError
				)
		)
	);

const saveClientAccessToken = (adminClient: Client) => (token: AccessToken) =>
	pipe(
		getTokenFromDatabase(adminClient),
		TE.fold(createNewTokenIfNotFound(adminClient)(token), updateExistingToken(adminClient)(token))
	);

const renewClientAccessToken = (adminClient: Client) =>
	pipe(
		requestClientAccessToken(env_public.PUBLIC_KROGER_CLIENT_ID, env_secret.KROGER_SECRET),
		TE.map(
			(data) =>
				<AccessToken>{
					company: 'kroger',
					access_token: data.access_token,
					expires: new Date(Date.now() + data.expires_in * MILLISECONDS_PER_SECONDS).toISOString()
				}
		),
		TE.flatMap(saveClientAccessToken(adminClient))
	);

const getNewTokenIfExpired = (adminClient: Client) => (token: AccessTokenRecordModel) =>
	pipe(
		isExpiredNow(token),
		B.fold(
			() => TE.of(token),
			() => renewClientAccessToken(adminClient)
		)
	);

const renewTokenIfNotFound = (adminClient: Client) => (e: unknown) =>
	pipe(
		e instanceof ClientResponseError && e.status === 404,
		B.fold<TE.TaskEither<Error, AccessTokenRecordModel>>(
			() => TE.left(toError(e)),
			() => renewClientAccessToken(adminClient)
		)
	);

const getTokenFromDatabase = (adminClient: Client) =>
	TE.tryCatch(
		() =>
			adminClient
				.collection('client_tokens')
				.getFirstListItem<AccessTokenRecordModel>("company = 'kroger'"),
		toError
	);

export const getClientContextToken = (adminClient: Client) =>
	pipe(
		getTokenFromDatabase(adminClient),
		TE.orElse(renewTokenIfNotFound(adminClient)),
		TE.flatMap(getNewTokenIfExpired(adminClient))
	);
