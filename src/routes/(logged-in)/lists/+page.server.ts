import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from "fp-ts/lib/function";
import { getAllLists } from '$lib/functions/lists/db-accessors.js';
import { throwRequestErrors } from '$lib/functions/errors/throw-request-errors.js';

export const load = ({ locals }) => pipe(
    getAllLists(locals.pb),
    TE.map(lists => ({ lists })),
    TE.getOrElse(throwRequestErrors)
)()