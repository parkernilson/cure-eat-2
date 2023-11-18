import * as TE from 'fp-ts/lib/TaskEither';
import type { TaskEither } from 'fp-ts/lib/TaskEither';
import { error as logError, log } from 'fp-ts/lib/Console';
import { flow } from 'fp-ts/lib/function';

/**
 * Tap both the right and left values of a TaskEither pipeline and log them to the console
 */
export const debugTE: <E, A>(self: TaskEither<E, A>) => TaskEither<E, A> = flow(
	TE.tapIO(log),
	TE.tapError((e) => TE.of(logError(e)))
);

export const trace = <A>(a: A) => {
	console.log(a);
	return a;
}

export const traceWithMessage = <A>(loggable: unknown) => (a: A) => {
	console.log(loggable);
	console.log(a)
	return a;
}
