<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="h-full flex items-center">
	<div
		class="w-2/3 max-w-md m-auto
		px-3 py-8 pt-6
		shadow-md
		rounded-sm
		bg-slate-100"
	>
		<form method="POST">
			<h2 class="font-display text-6xl text-center mb-8">Login</h2>
			<div class="flex flex-col justify-center">
				<div class="mb-3">
					<input
						class="border border-black px-1 rounded-sm w-full"
						name="username"
						type="text"
						placeholder="username"
					/>
				</div>
				<div class="flex items-center mb-6">
					<input
						class="border border-black px-1 rounded-sm w-full"
						name="password"
						type="password"
						placeholder="password"
					/>
				</div>
				<div class="flex flex-col items-center">
					<button
						class="px-5 text-center cursor-pointer border border-black max-w-xs m-auto rounded-full"
						type="submit">Login</button
					>
					<p class="text-center mt-6">
						Need an account?
						<a href="/register" class="text-blue-400 hover:text-blue-600"> Register here </a>
					</p>
				</div>
			</div>
		</form>
	</div>
</div>
