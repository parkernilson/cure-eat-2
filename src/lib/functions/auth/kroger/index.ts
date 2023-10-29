import { KROGER_SECRET } from '$env/static/private';
import { PUBLIC_KROGER_CLIENT_ID } from '$env/static/public';
import { TOKEN_EXPIRATION_BUFFER_MILLIS } from '$lib/constants/auth/tokens';
import { responseToJson } from '$lib/functions/helpers';
import { updateOrCreate } from '$lib/functions/helpers/pocketbase';
import type {
	AccessToken,
	AccessTokenModel,
	KrogerAccessTokenResponse
} from '$lib/interfaces/tokens';
import { toError } from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as B from 'fp-ts/lib/boolean';
import { pipe } from 'fp-ts/lib/function';
import type Client from 'pocketbase';



/**
 * Request a new client access token from Kroger API
 */
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

/**
 * Save the Client Context access token to the database.
 * A Client Context token belongs to the app in general and is not specific to any user.
 * @param adminClient
 * @returns
 */
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
					expires: new Date(Date.now() + data.expires_in * 1000).toISOString()
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

const getClientContextTokenFromDb = (adminClient: Client) =>
	TE.tryCatch(
		() =>
			adminClient
				.collection('admin_tokens')
				.getFirstListItem<AccessTokenModel>("company = 'kroger'"),
		toError
	);

export const getClientContextToken = (adminClient: Client) =>
	pipe(
		getClientContextTokenFromDb(adminClient),
		// if the token is expired, request a new one
		TE.flatMap(getNewTokenIfExpired(adminClient))
	);

/*
Steps:
- Check to see if the user has a token already
- If they do not, redirect them to a page that requests them to authorize
    - That page will have a link to the kroger authorization flow
- When the kroger auth code is returned, they will be redirected to the endpoint that will get the token with
    the auth code, then save that to the database, then redirect them to the home page
- If the user does have a token, check to see if it's expired
    - if the token is expired, check to see if the refresh token is expired
    - if the refresh token is expired, redirect user to the auth page
    - if the refresh token is not expired, get a new one using the refresh token
- return the token
*/
// const getCustomerContextToken: (pb: Client, userId: string) => RefreshableAccessToken;

// export const getAccessTokenWithAuthorizationCode = (code: string) =>
// 	pipe(
// 		TE.tryCatch(
// 			() =>
// 				fetch(`https://api.kroger.com/v1/connect/oauth2/token`, {
// 					method: 'GET',
// 					headers: {
// 						Authorization: `Basic ${btoa(`${PUBLIC_KROGER_CLIENT_ID}:${KROGER_SECRET}`)}`,
// 						'Content-Type': 'application/json'
// 					},
// 					body: JSON.stringify({
// 						grant_type: 'authorization_code',
// 						code: code,
// 						redirect_uri: 'https://cureeat.com/kroger/authorize'
// 					})
// 				}),
// 			toError
// 		),
// 		TE.flatMap((response) =>
// 			TE.fromTask(() => response.json() as Promise<KrogerRefreshableAccessTokenResponse>)
// 		),
// 		TE.map(
// 			(data) =>
// 				<RefreshableAccessToken>{
// 					// TODO: fix this (it is not accurate)
// 					scope: 'cart.write:basic',
// 					access_token: data.access_token,
// 					expires: new Date(Date.now() + data.expires_in * 1000).toISOString(),
// 					refresh_token: data.refresh_token,
// 					refresh_expires: new Date(
// 						Date.now() + KROGER_REFRESH_TOKEN_DEFAULT_EXPIRATION * 1000
// 					).toISOString()
// 				}
// 		)
// 	);

// const getAccessToken = (pb: Client) => (userId: string) =>
// 	TE.tryCatch(
// 		() =>
// 			pb
// 				.collection('access_tokens')
// 				.getFirstListItem(`user = ${userId} && company.name = 'kroger'`),
// 		toError
// 	);

// const updateAccessToken =
// 	(pb: Client) => (newTokenData: AccessToken) => (existingTokenModel: RecordModel) =>
// 		TE.tryCatch(
// 			() =>
// 				pb
// 					.collection('access_tokens')
// 					.update<AccessTokenModel>(existingTokenModel.id, newTokenData),
// 			toError
// 		);

// export const saveAccessToken = (pb: Client, token: AccessToken | RefreshableAccessToken) =>
// 	pipe(
// 		pb.authStore.model?.id as string,
// 		TE.fromNullable(new Error('No user logged in')),
// 		TE.flatMap(getAccessToken(pb)),
// 		TE.flatMap(updateAccessToken(pb)(token)),
// 		TE.orElse((e) =>
// 			pipe(
// 				e instanceof ClientResponseError && e.status === 404,
// 				B.fold(
// 					() =>
// 						TE.tryCatch(
// 							() => pb.collection('access_tokens').create<AccessTokenModel>(token),
// 							toError
// 						),
// 					() => TE.left(e)
// 				)
// 			)
// 		)
// 	);

// export const saveAccessTokenCurried =
// 	(pb: Client) => (token: AccessToken | RefreshableAccessToken) =>
// 		saveAccessToken(pb, token);
