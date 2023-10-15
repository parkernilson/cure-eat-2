<script lang="ts">
    import { enhance } from '$app/forms';
	import type { ListItemModel } from '$lib/lists/db/interfaces.js';

    export let data;

    const sortByDate = (a: string, b: string) => Date.parse(a) - Date.parse(b)
    const sortListItemsByDate = (a: ListItemModel, b: ListItemModel) => sortByDate(a.created, b.created);

</script>

<h1>{data.list.title}</h1>
{#each data.list.items.sort(sortListItemsByDate) as item}
    <p>{item.id}: {item.value}</p>
{/each} 

<!-- add item to list -->
<form method="post" action="?/addItem" use:enhance>
    <input name="value" type="text" placeholder="new item">
    <button type="submit">Add new item</button>
</form>