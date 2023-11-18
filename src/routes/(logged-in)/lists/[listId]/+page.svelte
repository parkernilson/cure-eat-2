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

	const sortByDate = (a: string, b: string) => Date.parse(a) - Date.parse(b);
	const sortListItemsByDate = (a: ListItemRecord, b: ListItemRecord) =>
		sortByDate(a.created, b.created);

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
                    pipe(
                        performIO(
                            () =>
                                
                                (creatingNewItem = {
                                    value: '',
                                    index: data.list.items.findIndex((_) => _.id === eventItem.id)
                                })
                        ),
                        IO.flatMap(() => performIO(() => e.preventDefault()))
                    )
			)
		)();

    const handleNewItemKeyDown = (e: KeyboardEvent) =>
        pipe(
            e.key == 'Enter' && creatingNewItem?.value.trim() !== '',
            B.fold(
                () => doNothing(),
                () =>
                    pipe(
                        performIO(() => newItemForm.submit()),
                        IO.flatMap(() => performIO(() => (creatingNewItem = null)))
                    )
            )
        )();
</script>

<div class="flex items-center mt-8">
	<h1 class="font-display text-4xl text-slate-600">{data.list.title}</h1>
</div>
<hr class="mb-8" />
{#each data.list.items.sort(sortListItemsByDate) as item, i}
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
			<form bind:this={newItemForm} method="post" action="?/addItem">
                <input 
                    bind:this={newItemInput} 
                    class="flex-1 m-3" 
                    name="value"
                    bind:value={creatingNewItem.value} 
                />
			</form>
		</div>
	{/if}
    
	{#if i < data.list.items.length - 1}
		<hr />
	{/if}
{/each}

<!-- add item to list -->
<!-- <form method="post" action="?/addItem" use:enhance>
    <input name="value" type="text" placeholder="new item">
    <button type="submit">Add new item</button>
</form> -->
