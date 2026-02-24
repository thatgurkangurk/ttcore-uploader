<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { useSession } from "$lib/session.svelte";
	import type { PageProps } from "./$types";
	import SubmitForm from "./components/submit-form.svelte";

	let { data }: PageProps = $props();

	const session = useSession();
</script>

<Button href="/">go back</Button>

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">tt core submitter</h1>

<h2 class="text-2xl font-bold tracking-tight md:text-3xl">
	please submit your videos for traitor town core {data.currentVideo}
</h2>

{#if session.current?.user}
	<SubmitForm />
{/if}
