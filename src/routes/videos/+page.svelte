<script lang="ts">
	import ToggleSubmissionsOpen from "$lib/components/toggle-submissions-open.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { useSession } from "$lib/session.svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();

	const session = useSession();
</script>

<Button href="/">go back</Button>

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">videos</h1>

<ToggleSubmissionsOpen />

<h2 class="text-2xl font-bold tracking-tight md:text-3xl">here are all the videos</h2>

<div class="flex w-fit flex-col gap-2">
	{#each data.allVideos as video}
		<Button href="/videos/{video.id}">traitor town core {video.id}</Button>
	{/each}
</div>
