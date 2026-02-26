<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import { ModeWatcher } from "mode-watcher";
	import { SessionState, setSession } from "$lib/session.svelte.js";
	import Navbar from "$lib/components/navbar.svelte";

	let { children, data } = $props();

	// svelte-ignore state_referenced_locally
	let sessionState = new SessionState($state.snapshot(data.session));

	setSession(sessionState);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<ModeWatcher defaultMode="dark" disableTransitions />

<div class="min-h-screen p-4">
	<Navbar />
	<div class="pt-4">
		<section class="flex min-h-[90vh] justify-center rounded-xl bg-gray-950 py-5 text-white">
			<div class="w-full max-w-7xl px-6">
				{@render children()}
			</div>
		</section>
	</div>
</div>
