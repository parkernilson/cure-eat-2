import * as TE from 'fp-ts/lib/TaskEither'
import { toError } from 'fp-ts/lib/Either'
import type PocketBase from 'pocketbase'
import { retryUntilSucceeds } from "../fp/retry-until-succeeds";

/**
 * Will try to connect to the Pocketbase server until it succeeds or times out.
 */
export const establishConnection = async (pb: PocketBase) =>
    await retryUntilSucceeds(() => TE.tryCatch(() => pb.health.check(), toError), {
        retryDelayMillis: 100,
        timeoutMillis: 5000
    })();