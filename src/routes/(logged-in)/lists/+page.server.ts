import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import { pipe } from "fp-ts/lib/function";
import { handleAndThrowErrors } from '$lib/utils/fp';
import { getAllLists } from '$lib/lists/db/index.js';

export const load = ({ locals }) => pipe(
    getAllLists(locals.pb),
    TE.map(lists => ({ lists })),
    T.map(handleAndThrowErrors)
)()