<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import { SessionState, setSession } from "$lib/session.svelte.js";

	let { children, data } = $props();

	// svelte-ignore state_referenced_locally
	let sessionState = new SessionState($state.snapshot(data.session));

	setSession(sessionState);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
