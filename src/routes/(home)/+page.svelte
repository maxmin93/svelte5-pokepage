<script>
	let { data } = $props();
</script>

<div class="hero min-h-screen bg-base-300">
	<div class="hero-content">
		<div class="max-w-md text-center">
			<h1 class="text-4xl font-bold text-neutral-content">Welcome to PokePage</h1>
			<p class="py-6 font-mono">
				Create an account to make your own PokePage with your own unique URL!
			</p>
			{#if !data.session}
				<a href="/login" class="btn btn-primary">Create An Account</a>
			{/if}
		</div>
	</div>
</div>
