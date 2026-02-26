<script>
	import { useSession } from "$lib/session.svelte";
	import ModeToggle from "./mode-toggle.svelte";
	import { Button } from "$lib/components/ui/button/index.js";

	const session = useSession();
</script>

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
