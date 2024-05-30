<script>
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import { goto } from '$app/navigation';

	let { data } = $props();

	$effect(() => {
		$inspect('login:', data.session);

		// 처음 한번만 체크하면 된다. 이후 변동 없음
		if (data.session) {
			setTimeout(() => goto('/')); // already signed-in
		}
	});
</script>

<div class="hero min-h-screen bg-base-300">
	<div class="hero-content w-[800px]">
		<div class="flex flex-col">
			<p>Create an account or login below!</p>
			<!-- Supabase Auth UI -->
			<Auth
				supabaseClient={data.supabase}
				theme="dark"
				appearance={{
					theme: ThemeSupa,
					style: {
						input: 'width: 400px;',
					},
				}}
			/>
		</div>
	</div>
</div>
