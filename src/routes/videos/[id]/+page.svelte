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

	let { data }: PageProps = $props();

	const session = useSession();
</script>

<Button href="/videos">go back</Button>

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">
	all clips for traitor town core {page.params.id}
</h1>

<div class="flex w-fit flex-col gap-2">
	{#each data.allClips as clip}
		<Card class="h-full w-full">
			<CardHeader>
				<CardTitle class="text-xl">{clip.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<!-- svelte-ignore a11y_media_has_caption -->
				<video src={clip.url} controls preload="metadata"></video>
			</CardContent>
			<CardFooter class="grid grid-cols-1 gap-1">
				<p>
					created by <span>{clip.creator!.name}</span>
				</p>
			</CardFooter>
		</Card>
	{/each}
</div>
