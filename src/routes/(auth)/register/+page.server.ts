import { getAdminClient, registerUsernamePassword } from '$lib/functions/auth/pocketbase';
import { throwRequestErrors } from '$lib/functions/errors';
import { redirect } from '@sveltejs/kit';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';

export const load = async ({ locals }) => ({ user: locals.pb.authStore.model })

export const actions = {
	default: async ({ request }) => pipe(
		getAdminClient(),
		TE.flatMap(adminClient => pipe(
			TE.fromTask(() => request.formData()),
			TE.flatMap(formData => 
				registerUsernamePassword(
					adminClient, 
					(formData.get('username') ?? "") as string, 
					(formData.get('password') ?? "") as string,
				)
			),
			TE.map(authResponse => authResponse.record),
			TE.getOrElse(throwRequestErrors),
			T.map(() => { throw redirect(302, '/login') })
		))
	)(),
};
