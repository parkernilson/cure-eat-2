<script lang="ts">
	import * as B from 'fp-ts/lib/boolean';
	import * as IO from 'fp-ts/lib/IO';
	import { flow, pipe } from 'fp-ts/lib/function';
	import { enhance } from '$app/forms';
	import ListItem from '$lib/components/lists/ListItem.svelte';
	import type { ListItemRecord } from '$lib/interfaces/lists';
	import { doNothing, performIO } from '$lib/functions/utils/fp/io';
	import { concatAll } from 'fp-ts/lib/Monoid.js';
	import { getApplicativeMonoid } from 'fp-ts/lib/Applicative.js';

	export let data;

	const sortByOrdinal = (a: ListItemRecord, b: ListItemRecord) =>
		a.ordinal - b.ordinal;

	type NewItem = {
		value: string;
		index: number;
	};
	let creatingNewItem: NewItem | null;
	let newItemInput: HTMLInputElement;
	$: newItemInput && newItemInput.focus();

	let newItemForm: HTMLFormElement;

	const handleListItemKeyDown = (e: KeyboardEvent, eventItem: ListItemRecord) =>
		pipe(
			e.key == 'Enter' && eventItem.value.trim() !== '',
			B.fold(
				() => doNothing(),
				() =>
					performIO(() => {
						creatingNewItem = {
							value: '',
							index: data.list.items.findIndex((_) => _.id === eventItem.id)
						};
						e.preventDefault(); // prevent the event from transferring to the newly focused input
					})
			)
		)();

	const handleNewItemKeyDown = (e: KeyboardEvent) =>
		pipe(
			e.key == 'Enter' && creatingNewItem?.value.trim() !== '',
			B.fold(
				() => doNothing(),
				() =>
					performIO(() => {
						newItemForm.submit();
						creatingNewItem = null;
					})
			)
		)();
</script>

<div class="flex items-center mt-8">
	<h1 class="font-display text-4xl text-slate-600">{data.list.title}</h1>
</div>
<hr class="mb-8" />
{#each data.list.items.sort(sortByOrdinal) as item, i}
	<ListItem {item} onKeyDown={handleListItemKeyDown} />

	{#if creatingNewItem && i === creatingNewItem.index}
		<hr />

		<div class="flex items-center">
			<i
				class="
                fa-regular fa-circle
                mr-3
            "
			/>
			<form bind:this={newItemForm} method="post" action="?/addItem" on:submit|preventDefault>
				<input
					bind:this={newItemInput}
					class="flex-1 m-3"
					name="value"
					bind:value={creatingNewItem.value}
                    on:keydown={handleNewItemKeyDown}
				/>
				<input value={creatingNewItem.index + 1} name="ordinal" type="hidden" />
			</form>
		</div>
	{/if}

	{#if i < data.list.items.length - 1}
		<hr />
	{/if}
{/each}
