import { handleRequestErrors } from '$lib/functions/errors/errors.js';
import { getStringFromForm } from '$lib/functions/helpers/fp/formData.js';
import { json } from '@sveltejs/kit';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import { pipe } from "fp-ts/lib/function";
import { searchKrogerProduct } from '$lib/functions/products/kroger';

export const actions = {
    default: ({ request }) => pipe(
        getStringFromForm(request)("search-term"),
        TE.flatMap(searchKrogerProduct),
        TE.getOrElse(handleRequestErrors),
        T.map(json)
    )()
}