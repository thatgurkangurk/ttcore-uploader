<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { useSession } from "$lib/session.svelte";
	import type { PageProps } from "./$types";
	import SubmitForm from "./components/submit-form.svelte";

	let { data }: PageProps = $props();

	const session = useSession();
</script>

{#if data.submissionsOpen}
	<Button href="/">go back</Button>

	<h1 class="text-3xl font-bold tracking-tight md:text-4xl">tt core submitter</h1>

	<h2 class="text-2xl font-bold tracking-tight md:text-3xl">
		please submit your videos for traitor town core {data.currentVideo}
	</h2>

	{#if session.current?.user}
		<SubmitForm />
	{/if}
{:else}
	<h1 class="text-3xl font-bold tracking-tight md:text-4xl">
		sorry, but submissions are not open at the moment, please check back later !
	</h1>

	{#if data.submitters.length > 0}
		<br />
		<p class="font-bold">
			but thank you to all of these amazing people who submitted for traitor town core {data.currentVideo}:
		</p>

		<ul class="pl-2">
			{#each data.submitters as submitter (submitter.id)}
				<li>{submitter.name} - <span>@{submitter.username}</span></li>
			{/each}
		</ul>
	{/if}
{/if}
