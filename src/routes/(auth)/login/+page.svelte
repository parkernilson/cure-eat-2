<script lang="ts">
	import LoginRegisterCard from '$lib/components/ui/LoginRegisterCard.svelte';

	// TODO: handle login
	const handleSignIn = () => {}
</script>

<div class="h-full flex items-center">
	<LoginRegisterCard type="login" onSubmit={handleSignIn} />
</div>