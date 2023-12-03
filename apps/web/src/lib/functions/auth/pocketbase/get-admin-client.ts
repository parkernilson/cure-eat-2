import { env } from '$env/dynamic/private';
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
		() => TE.tryCatch(async () => {
			adminClient = new PocketBase('http://pocketbase:8090');
			await adminClient.admins.authWithPassword(env.PB_ADMIN_EMAIL, env.PB_ADMIN_PASSWORD);
			return adminClient;
		}, toError),
		() => TE.of(adminClient)
	)
)