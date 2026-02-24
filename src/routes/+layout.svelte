<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import { ModeWatcher } from "mode-watcher";
	import { SessionState, setSession, useSession } from "$lib/session.svelte.js";
	import ModeToggle from "$lib/components/mode-toggle.svelte";
	import { Button } from "$lib/components/ui/button/index.js";

	let { children, data } = $props();

	// svelte-ignore state_referenced_locally
	let sessionState = new SessionState($state.snapshot(data.session));

	setSession(sessionState);

	const session = useSession();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<ModeWatcher defaultMode="dark" />

{#snippet authStatus()}
	<div class="flex flex-row items-center gap-3">
		<ModeToggle />

		{#if session.current?.user}
			<p>hi, {session.current.user.name}!</p>
			<Button class="pl-0" variant="link" onclick={() => session.signOut()}>sign out</Button>
		{:else}
			<Button class="pl-0" variant="link" onclick={() => session.signInSocial("discord")}
				>sign in with Discord</Button
			>
		{/if}
	</div>
{/snippet}

<div class="min-h-screen p-4">
	{@render authStatus()}
	<div class="pt-4">
		<section class="flex min-h-[90vh] justify-center rounded-xl bg-gray-950 py-5 text-white">
			<div class="w-full max-w-7xl px-6">
				{@render children()}
			</div>
		</section>
	</div>
</div>
