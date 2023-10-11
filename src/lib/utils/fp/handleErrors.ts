import * as TE from 'fp-ts/TaskEither';
import { error } from 'fp-ts/lib/Console';

/**
 * Handle errors that may occur in the given monadic action by tapping and emitting them to a toast message
 */
export const handleErrors = TE.tapError((e) => TE.fromIO(error(e)))
