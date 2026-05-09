<script lang="ts">
	import { resolve } from "$app/paths";
	import { getMyClipsForVideo, getVideoById } from "$lib/api/video.remote.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import type { PageProps } from "./$types";
	import ClipCard from "./components/clip-card.svelte";

	let { params }: PageProps = $props();
</script>

<Button href={resolve("/user")}>go back</Button>

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">
	all my clips for {(await getVideoById({ videoId: params.id })).title}
</h1>

<div class="grid w-fit gap-4 pt-2 sm:grid-cols-1 md:grid-cols-3">
	{#each await getMyClipsForVideo({ videoId: params.id }) as clip (clip.id)}
		<ClipCard {clip} />
	{/each}
</div>
