import type { TaskEither } from "fp-ts/lib/TaskEither";
import type { Either } from 'fp-ts/lib/Either'
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import * as B from 'fp-ts/lib/boolean'
import { now } from "fp-ts/lib/Date";
import { type LazyArg, pipe } from "fp-ts/lib/function";

interface RetryActionOptions {
  timeoutMillis: number;
  retryDelayMillis: number;
}

const retryAction =
  <A = unknown>(
    action: LazyArg<TaskEither<Error, A>>,
    options: RetryActionOptions
  ): ((startTime: number) => TaskEither<Error, A>) =>
  (startTime: number) =>
    pipe(
      action(),
      T.delay(options.retryDelayMillis),
      TE.orElse(() =>
        pipe(
          TE.fromIO(now),
          TE.map((curTime) => curTime - startTime < options.timeoutMillis),
          TE.flatMap(B.fold(
            () => TE.left(new Error("Timeout")),
            () => retryAction(action, options)(startTime)
          )),
        )
      )
    );

export const retryUntilSucceeds = <A = unknown>(
  action: LazyArg<TaskEither<Error, A>>,
  options: RetryActionOptions
): TaskEither<Error, A> =>
  T.getRaceMonoid<Either<Error, A>>().concat(
    T.delay(options.timeoutMillis)(
      TE.left(new Error(`Timeout after ${options.timeoutMillis}ms`))
    ),
    pipe(TE.fromIO(now), TE.flatMap(retryAction(action, options)))
  )
