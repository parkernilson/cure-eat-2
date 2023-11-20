<script lang="ts">
	import ListItem from '$lib/components/lists/ListItem.svelte';
	import type { ListItemRecord } from '$lib/interfaces/lists';

	export let data;

	const sortByOrdinal = (a: ListItemRecord, b: ListItemRecord) => a.ordinal - b.ordinal;

</script>

<div class="flex items-center mt-8">
	<h1 class="font-display text-4xl text-slate-600">{data.list.title}</h1>
</div>
<hr class="mb-8" />

{#if data.list.items.length === 0}
	<!-- <NewItem submit={newItemSubmit} placeholder="Tap to create your first item" ordinal={0} /> -->
	<form method="post" action="?/addItem">
		<input name="ordinal" value={0} type="hidden" />
		<input name="value" value={''} type="hidden" />
		<button>Tap to create your first item</button>
	</form>
{/if}

{#each data.list.items.sort(sortByOrdinal) as item, i}
	<!-- TODO: to focus the new list item, we will probably need some kind of callback for the action result in the ListItem component -->
	<ListItem {item} />

	{#if i < data.list.items.length - 1}
		<hr />
	{/if}
{/each}
