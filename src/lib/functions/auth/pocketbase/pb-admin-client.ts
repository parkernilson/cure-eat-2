import { PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD } from '$env/static/private';
import { toError } from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as B from 'fp-ts/lib/boolean'
import type Client from 'pocketbase';
import PocketBase from 'pocketbase';
import { pipe } from 'fp-ts/lib/function';

let adminClient: Client;

/** 
 * Get an admin-level client for PocketBase. 
 * This client should only be used for admin-level operations when necessary.
 * Wherever possible, use the user-authenticated client instead.
 */
export const getAdminClient = () => pipe(
	!!adminClient,
	B.fold(
		() => TE.of(adminClient),
		() => TE.tryCatch(async () => {
			adminClient = new PocketBase('http://127.0.0.1:8090');
			await adminClient.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
			return adminClient;
		}, toError)
	)
)