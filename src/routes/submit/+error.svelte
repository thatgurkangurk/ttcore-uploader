<script lang="ts">
	import { page } from "$app/state";
	import { Button } from "$lib/components/ui/button/index.js";
	import { useSession } from "$lib/session.svelte";

	const session = useSession();
</script>

{#if page.status === 403}
	<h1 class="text-3xl font-bold tracking-tight md:text-4xl">please sign in to continue</h1>
	<br />
	<Button
		onclick={() =>
			session.authClient.signIn.social({
				provider: "discord",
				loginHint: "yes"
			})}>sign in with Discord</Button
	>
{:else}
	<h1>error {page.status}: {page.error?.message}</h1>
{/if}
