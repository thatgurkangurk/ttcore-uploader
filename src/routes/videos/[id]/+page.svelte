<script lang="ts">
	import { page } from "$app/state";
	import { Button } from "$lib/components/ui/button/index.js";
	import { useSession } from "$lib/session.svelte";
	import type { PageProps } from "./$types";
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from "$lib/components/ui/card/index.js";
	import Star from "@lucide/svelte/icons/star";
	import { getClipsForVideo, getVideoById } from "$lib/api/video.remote";
	import { setClipSelected } from "$lib/api/clip.remote";
	import ToggleSubmissionsOpen from "$lib/components/toggle-submissions-open.svelte";

	let { data, params }: PageProps = $props();

	const session = useSession();

	const video = $derived(
		await getVideoById({
			videoId: params.id
		})
	);

	const clips = $derived(
		await getClipsForVideo({
			videoId: params.id
		})
	);
</script>

<Button href="/videos">go back</Button>

<ToggleSubmissionsOpen videoId={video.id} />

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">
	all clips for {video.title}
</h1>

<div class="grid w-fit gap-4 pt-2 sm:grid-cols-1 md:grid-cols-3">
	{#each clips as clip}
		<Card class="h-full w-full">
			<CardHeader>
				<CardTitle class="text-xl">{clip.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="aspect-video w-full overflow-hidden rounded-lg">
					<!-- svelte-ignore a11y_media_has_caption -->
					<video class=" h-40 w-full object-cover" src={clip.url} controls preload="none"></video>
				</div>
			</CardContent>
			<CardFooter class="grid grid-cols-1 gap-1">
				<p>
					created by <span>{clip.creator!.name}</span>
				</p>
				<Button
					onclick={async () =>
						await setClipSelected({
							clipId: clip.id,
							selected: !clip.selected
						})}
					variant="outline"
					size="icon"
				>
					<Star {...clip.selected ? { fill: "#ffffff" } : {}} />
				</Button>
			</CardFooter>
		</Card>
	{/each}
</div>
