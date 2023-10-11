<script lang="ts">
	import CenterCard from './CenterCard.svelte';

	let email: string = '';
	let password: string = '';
	let passwordVisible: boolean;
	const togglePasswordVisibility = () => (passwordVisible = !passwordVisible);

	export let type: 'login' | 'register';

	export let onSubmit: (email: string, password: string) => void = () => {};
</script>

<CenterCard>
	<h1 class="font-display text-6xl text-center mb-8">{type === 'login' ? 'Login' : 'Register'}</h1>
	<div class="flex flex-col justify-center">
		<!-- Email input -->
		<div class="mb-3">
			<input
				class="border border-black px-1 rounded-sm w-full"
				placeholder="Email"
				bind:value={email}
			/>
		</div>
		<!-- Password input -->
		<div class="flex items-center mb-6">
			<!-- We have to manually update the password value because we are using dynamic input type -->
			<input
				class="border border-black px-1 rounded-sm w-full"
				type={passwordVisible ? 'text' : 'password'}
				value={password}
				on:input={(e) => (password = e.currentTarget.value)}
				placeholder="Password"
			/>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<i
				class="fa-solid {passwordVisible
					? 'fa-eye-slash'
					: 'fa-eye'} ml-[-30px] hover:cursor-pointer"
				on:click={togglePasswordVisibility}
			/>
		</div>
		<div class="flex flex-col items-center">
			<button
				on:click={() => onSubmit(email, password)}
				class="px-5 text-center cursor-pointer border border-black max-w-xs m-auto rounded-full"
			>
				{type === 'login' ? 'Login' : 'Register'}
			</button>
			<p class="text-center mt-6">
				{#if type === 'login'}
					Need an account?
					<a href="/register" class="text-blue-400 hover:text-blue-600"> Register here </a>
				{:else if type === 'register'}
					Already have an account?
					<a href="/login" class="text-blue-400 hover:text-blue-600"> Log in here </a>
				{/if}
			</p>
		</div>
	</div>
</CenterCard>
