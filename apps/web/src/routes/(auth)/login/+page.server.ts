import { authWithPassword } from '$lib/functions/auth/pocketbase';
import { throwRequestErrors } from '$lib/functions/errors';
import { getFormData, getStringWithKey } from '$lib/functions/utils/fp';
import { redirect } from '@sveltejs/kit';
import * as T from 'fp-ts/lib/Task';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { sequenceT } from 'fp-ts/lib/Apply';

export const load = async ({ locals }) => ({ user: locals.pb.authStore.model });

const getUsernamePasswordFromForm = (formData: FormData) =>
	sequenceT(E.Applicative)(
		getStringWithKey(formData)('username'),
		getStringWithKey(formData)('password')
	);

export const actions = {
	default: async ({ locals, request }) =>
		pipe(
			getFormData(request),
			TE.flatMapEither(getUsernamePasswordFromForm),
			TE.flatMap((usernamePassword) => authWithPassword(locals.pb)(...usernamePassword)),
			TE.map((authResponse) => authResponse.record),
			TE.getOrElse(throwRequestErrors),
			T.map(() => {
				throw redirect(302, '/lists');
			})
		)()
};
