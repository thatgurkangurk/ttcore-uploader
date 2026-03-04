<script lang="ts">
	import { resolve } from "$app/paths";
	import { getVideos } from "$lib/api/video.remote";
	import { Button } from "$lib/components/ui/button/index.js";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();

	const videos = $derived(await getVideos());
</script>

<Button href="/">go back</Button>

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">gurkan's video submitter</h1>

<p class="font-bold">here are all the current open submissions:</p>

<div class="grid w-fit grid-cols-1 gap-3">
	{#each videos as video (video.id)}
		<Button
			href={resolve("/submit/[videoId]", {
				videoId: video.id
			})}>{video.title}</Button
		>
	{:else}
		<p class="font-bold">no clip submissions are open at the moment !</p>
	{/each}
</div>
