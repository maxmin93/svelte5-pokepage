<script>
	import { goto } from '$app/navigation';
	import { RiSunLine, RiMoonLine } from 'svelte-remixicon';
	import { onMount } from 'svelte';
	import { toggleTheme } from '$lib/utils/tw-util.js';

	let { children, data } = $props();
	console.log('HOME +layout.svelte');

	let isDark = $state(true); // html[data-theme="dark"]
	onMount(() => {
		console.log('layout: onMount');
		isDark = localStorage.getItem('theme') === 'dark';
	});

	$effect(() => {
		console.log('layout: afterUpdate');
		toggleTheme(isDark);
	});
</script>

<!-- Navbar -->
<div class="fixed left-0 right-0 top-0 z-50 justify-between bg-base-100">
	<div class="navbar mx-auto max-w-3xl justify-between">
		<!--left side of navbar-->
		<div>
			<a href="/" class="btn btn-ghost text-xl">PokePage</a>
			{#if data.session !== null}
				<a href="/{data.session.user.email}" class="btn btn-ghost">My Page</a>
			{/if}
		</div>
		<!--right side of navbar-->
		<div>
			{#if data.session == null}
				<button onclick={() => goto('/login')}>Login</button>
			{:else}
				<span class="ml-2 text-lg text-accent">{data.session.user.email}</span>
				<button
					class="ml-2"
					onclick={async () => {
						await data.supabase.auth.signOut();
					}}>Logout</button
				>
			{/if}
		</div>
		<!--right side of navbar-->
		<div class="pr-4">
			<label class="flex cursor-pointer place-content-center gap-2">
				<RiSunLine size="20px"></RiSunLine>
				<input type="checkbox" bind:checked={isDark} class="toggle" />
				<RiMoonLine size="20px"></RiMoonLine>
			</label>
		</div>
	</div>
</div>

{@render children()}
