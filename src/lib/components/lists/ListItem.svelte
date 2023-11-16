<script lang="ts">
	import type { ListItemRecord } from "$lib/interfaces/lists";

    export let item: ListItemRecord

</script>

<p>{item.id}: {item.value}</p>
<form method="post" action="?/searchProduct">
    <input class="hidden" name="searchTerm" type="text" value={item.value} />
    <button type="submit">Search product</button>
</form>