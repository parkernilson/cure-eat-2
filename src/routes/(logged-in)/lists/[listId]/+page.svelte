<script lang="ts">
	import ListItem from '$lib/components/lists/ListItem.svelte';
	import NewItem from '$lib/components/lists/NewItem.svelte';
	import { doNothing, performIO } from '$lib/functions/utils/fp/io';
	import type { ListItemRecord } from '$lib/interfaces/lists';
	import * as B from 'fp-ts/lib/boolean';
	import { pipe } from 'fp-ts/lib/function';

	export let data;

	const sortByOrdinal = (a: ListItemRecord, b: ListItemRecord) => a.ordinal - b.ordinal;

	type NewItem = {
		value: string;
		index: number;
	};
	let creatingNewItem: NewItem | null;

	const handleListItemKeyDown = (e: KeyboardEvent, eventItem: ListItemRecord) =>
		pipe(
			e.key == 'Enter' && eventItem.value.trim() !== '',
			B.fold(
				() => doNothing(),
				() =>
					performIO(() => {
						creatingNewItem = {
							value: '',
							index: data.list.items.findIndex((itemToInsertAfter) => itemToInsertAfter.id === eventItem.id)
						};
						e.preventDefault(); // prevent the event from transferring to the newly focused input
					})
			)
		)();


</script>

<div class="flex items-center mt-8">
	<h1 class="font-display text-4xl text-slate-600">{data.list.title}</h1>
</div>
<hr class="mb-8" />

{#if data.list.items.length === 0}
	<NewItem placeholder="Tap to create your first item" ordinal={0} />
{/if}

{#each data.list.items.sort(sortByOrdinal) as item, i}
	<ListItem {item} onKeyDown={handleListItemKeyDown} />

	{#if creatingNewItem && i === creatingNewItem.index}
		<hr />

		<NewItem ordinal={i + 1} />

	{/if}

	{#if i < data.list.items.length - 1}
		<hr />
	{/if}
{/each}
