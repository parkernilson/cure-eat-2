import * as TE from 'fp-ts/TaskEither';
import type { TaskEither } from 'fp-ts/TaskEither';
import { error as logError, log } from 'fp-ts/lib/Console';
import { flow } from 'fp-ts/lib/function';

/**
 * Tap both the right and left values of a TaskEither pipeline and log them to the console
 */
export const debugTE: <E, A>(self: TaskEither<E, A>) => TaskEither<E, A> = flow(
	TE.tapIO(log),
	TE.tapError((e) => TE.of(logError(e)))
);
