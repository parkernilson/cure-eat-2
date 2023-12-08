import { toError } from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import type Client from 'pocketbase';

export const setLocation =
	(pb: Client) =>
	(listId: string) =>
	({ locationId, locationName }: { locationId: string; locationName: string }) =>
		pipe(
			TE.tryCatch(
				() =>
					pb
						.collection('lists')
						.update(listId, { location_id: locationId, location_name: locationName }),
				toError
			)
		);
