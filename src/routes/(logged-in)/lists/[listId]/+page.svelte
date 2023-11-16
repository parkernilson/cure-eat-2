<script lang="ts">
    import { enhance } from '$app/forms';
	import ListItem from '$lib/components/lists/ListItem.svelte';
	import type { ListItemRecord } from '$lib/interfaces/lists';

    export let data;

    const sortByDate = (a: string, b: string) => Date.parse(a) - Date.parse(b)
    const sortListItemsByDate = (a: ListItemRecord, b: ListItemRecord) => sortByDate(a.created, b.created);

</script>

<div class="flex items-center mt-8">
	<h1 class="font-display text-4xl text-slate-600">{data.list.title}</h1>
</div>
<hr class="mb-8" />
{#each data.list.items.sort(sortListItemsByDate) as item}
    <ListItem {item} />
{/each} 

<!-- add item to list -->
<form method="post" action="?/addItem" use:enhance>
    <input name="value" type="text" placeholder="new item">
    <button type="submit">Add new item</button>
</form>