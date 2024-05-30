<script lang="ts">
	import '../app.pcss';
	import { themeChange } from 'theme-change';
	import TwIndicator from '$lib/utils/tw-indicator.svelte';
	import { goto, invalidate, invalidateAll } from '$app/navigation';

	let { children, data } = $props();
	console.log('ROOT +layout.svelte');

	/*
	let { supabase, session } = data;

	// https://supabase.com/docs/reference/javascript/auth-onauthstatechange
	supabase.auth.onAuthStateChange(async (event, session) => {
		console.log('event:', event);

		if (event === 'INITIAL_SESSION') {
			// handle initial session
		} else if (event === 'SIGNED_IN') {
			// setTimeout(() => goto('/'));
			// invalidateAll();
			invalidate('supabase:auth');
		} else if (event === 'SIGNED_OUT') {
			// setTimeout(() => goto('login'));
			setTimeout(() => goto(''));
			// invalidateAll();
			invalidate('supabase:auth');
		}
	});
	*/
</script>

{@render children()}

<TwIndicator />
