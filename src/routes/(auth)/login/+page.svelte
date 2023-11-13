<script lang="ts">
	import LoginRegisterCard from '$lib/components/ui/LoginRegisterCard.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;

</script>

{#if data?.user}
	<p>logged in as {data.user.username}</p>
{/if}

<form method="POST">
	<input name="username" type="text" placeholder="username">
	<input name="password" type="password" placeholder="password">
	<button type="submit">Login</button>
</form>