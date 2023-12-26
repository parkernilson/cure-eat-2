<script lang="ts">
	import { enhance } from '$app/forms';
	import ListItem from '$lib/components/lists/ListItem.svelte';
	import LocationPicker from '$lib/components/locations/LocationPicker.svelte';
	import type { ListItemRecord } from '$lib/interfaces/lists';

	export let data;

	const listItemInputs: HTMLInputElement[] = [];
	const focusItemAt = (index: number) =>
		index < listItemInputs.length && index >= 0 ? listItemInputs[index].focus() : undefined;

	const sortByOrdinal = (a: ListItemRecord, b: ListItemRecord) => a.ordinal - b.ordinal;

	$: sortedListItems = data.list.items.sort(sortByOrdinal)

</script>

<div class="flex items-center mt-8">
	<h1 class="font-display text-4xl text-slate-600">{data.list.title}</h1>
</div>
<LocationPicker list={data.list} />
<hr class="mb-8" />

{#if data.list.items.length === 0}
	<form method="post" action="?/addItem">
		<input name="ordinal" value={0} type="hidden" />
		<input name="newValue" value={''} type="hidden" />
		<button>Tap to create your first item</button>
	</form>
{/if}

{#each sortedListItems as item, i (item.id)}
	<ListItem bind:valueInput={listItemInputs[i]} index={i} {item} list={data.list} {focusItemAt} />

	{#if i < data.list.items.length - 1}
		<hr />
	{/if}
{/each}
