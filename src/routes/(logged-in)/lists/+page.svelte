<script lang="ts">
    export let data;

</script>

<h1>Lists</h1>
{#each data.lists as list}
    <a href="/lists/{list.id}">{list.id}</a>
{/each}