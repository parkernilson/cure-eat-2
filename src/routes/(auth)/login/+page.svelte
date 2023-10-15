<script lang="ts">
	import LoginRegisterCard from '$lib/components/ui/LoginRegisterCard.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;

</script>

<div class="h-full flex items-center">
	<form method="POST">
		<input name="username" type="text" placeholder="username">
		<input name="password" type="password" placeholder="password">
		<button type="submit">Login</button>
	</form>
	{#if data?.user}
		<p>logged in as {data.user.username}</p>
	{/if}
</div>