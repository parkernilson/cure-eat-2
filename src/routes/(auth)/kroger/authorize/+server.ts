import { pipe } from 'fp-ts/lib/function';
import type { RequestHandler } from './$types';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import { json } from '@sveltejs/kit';
import { getAccessTokenWithAuthorizationCode, saveAccessTokenCurried } from '$lib/functions/auth/kroger/tokens';
import { handleRequestErrors } from '$lib/functions/errors/handle-request-errors';

export const POST: RequestHandler =  ({ url, locals }) =>
	pipe(
		url.searchParams.get('code'),
		TE.fromNullable(new Error('No code provided')),
		TE.flatMap(getAccessTokenWithAuthorizationCode),
		TE.flatMap(saveAccessTokenCurried(locals.pb)),
		TE.getOrElse(handleRequestErrors),
		T.map(json)
	)();
