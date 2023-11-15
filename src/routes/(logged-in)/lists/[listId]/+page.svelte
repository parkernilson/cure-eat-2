<script lang="ts">
    import { enhance } from '$app/forms';
	import type { ListItemRecord } from '$lib/interfaces/lists';

    export let data;
    export let form;

    const sortByDate = (a: string, b: string) => Date.parse(a) - Date.parse(b)
    const sortListItemsByDate = (a: ListItemRecord, b: ListItemRecord) => sortByDate(a.created, b.created);

</script>

{#if form}
    <h1>Form response</h1>
    <p>{JSON.stringify(form)}</p>
{/if}

<h1>{data.list.title}</h1>
{#each data.list.items.sort(sortListItemsByDate) as item}
    <p>{item.id}: {item.value}</p>
    <form method="post" action="?/searchProduct" use:enhance>
        <input class="hidden" name="searchTerm" type="text" value={item.value} />
        <button type="submit">Search product</button>
    </form>
{/each} 

<!-- add item to list -->
<form method="post" action="?/addItem" use:enhance>
    <input name="value" type="text" placeholder="new item">
    <button type="submit">Add new item</button>
</form>