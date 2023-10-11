import { goto } from '$app/navigation';
import type { Task } from 'fp-ts/Task';

/** Gives a task that reroutes the user to the given url */
export const gotoTask =
	(url: string): Task<void> =>
	() =>
		goto(url);
