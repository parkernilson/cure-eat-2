import { updateOrCreate } from '$lib/functions/utils/pocketbase';
import * as E from 'fp-ts/lib/Either';
import { beforeEach, expect, it, describe, afterEach, vi } from 'vitest';
import PocketBase, { ClientResponseError } from 'pocketbase';

vi.mock('pocketbase', async () => {
	const actual = await vi.importActual('pocketbase')
    const PocketBaseMock = vi.fn()
	PocketBaseMock.prototype.collection = vi.fn()
	PocketBaseMock.prototype.collection.prototype.create = vi.fn()
	PocketBaseMock.prototype.collection.prototype.update = vi.fn()
    return {
		// @ts-ignore
		ClientResponseError: actual.ClientResponseError,
		default: PocketBaseMock
	}
})

describe('update-or-create unit', async () => {


	beforeEach(async () => {
	});

	afterEach(async () => {
	});

	it('should create record if it does not exist', async () => {
		// @ts-ignore
		vi.mocked(PocketBase.prototype.collection).mockReturnValue({
			create: vi.fn().mockResolvedValue({
				id: 'test_id',
				val1: 'val1 test',
				val2: 'val2 test'
			}),
			update: vi.fn().mockRejectedValue(new ClientResponseError({ status: 404 }))
		})
		const pb = new PocketBase()

		const data = {
			val1: 'val1 test',
			val2: 'val2 test'
		};

		const updatedRecord = await updateOrCreate<typeof data>(
			pb,
			'test_collection',
			'test_id',
			data
		)();

		expect(updatedRecord).toMatchObject(E.right(data));
	});

	// it.skip('should update record if it does exist', async () => {
	// 	const initialData = {
	// 		val1: 'initial val1',
	// 		val2: 'initial val2'
	// 	};

	// 	await pb.collection('test_collection').create<typeof initialData>(initialData);

	// 	const updatedData = {
	// 		val1: 'updated val1',
	// 		val2: 'updated val2'
	// 	};

	// 	const updatedRecord = await updateOrCreate<typeof updatedData>(
	// 		pb,
	// 		'test_collection',
	// 		'test_id',
	// 		updatedData
	// 	)();

	// 	expect(updatedRecord).toMatchObject(E.right(updatedData));
	// });
});
