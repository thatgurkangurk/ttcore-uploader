<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import type { PageProps } from "./$types";
	import { setVideoMessage, getClipsForVideo, getVideoById } from "$lib/api/video.remote";
	import ToggleSubmissionsOpen from "$lib/components/toggle-submissions-open.svelte";
	import { resolve } from "$app/paths";
	import ClipCard from "./clip-card.svelte";
	import { PressedKeys } from "runed";
	import { throttle } from "$lib/utils/throttle";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Label } from "$lib/components/ui/label";
	import { Textarea } from "$lib/components/ui/textarea";
	import InputErrors from "$lib/components/form/input-errors.svelte";

	let { params }: PageProps = $props();

	const videoPromise = $derived(
		getVideoById({
			videoId: params.id
		})
	);

	const clipsPromise = $derived(
		getClipsForVideo({
			videoId: params.id
		})
	);

	const video = $derived(await videoPromise);

	const clips = $derived(await clipsPromise);

	const keys = new PressedKeys();

	const throttledRefresh = throttle(() => {
		getClipsForVideo({ videoId: params.id }).refresh();
	}, 500);

	function toErrors(arr: string[]): [string, ...string[]] | null {
		if (arr.length === 0) return null;

		const [first, ...rest] = arr;
		return [first, ...rest];
	}

	keys.onKeys(["shift", "r"], throttledRefresh);
</script>

<Button href={resolve("/videos")}>go back</Button>

<ToggleSubmissionsOpen videoId={video.id} />

<div>
	<Card class="my-6 w-72">
		<CardHeader>
			<CardTitle>set video message</CardTitle>
		</CardHeader>
		<CardContent>
			{@const setVideoMessageForm = setVideoMessage.for(video.id)}
			<form {...setVideoMessageForm}>
				<input {...setVideoMessageForm.fields.videoId.as("hidden", video.id)} />
				<div>
					<Label
						class={[!!setVideoMessageForm.fields.newMessage.issues() && "text-destructive", "pb-2"]}
						>message</Label
					>
					<Textarea
						{...setVideoMessageForm.fields.newMessage.as("text")}
						aria-errormessage="{setVideoMessageForm.fields.newMessage.as('text').name}-error"
						aria-invalid={!!setVideoMessageForm.fields.newMessage.issues()}
						placeholder={video.message}
					/>

					<InputErrors
						name={setVideoMessageForm.fields.newMessage.as("text").name}
						errors={toErrors(
							setVideoMessageForm.fields.newMessage.issues()?.map((value) => value.message) ?? []
						)}
					/>
				</div>

				<br />
				<Button type="submit">update</Button>
			</form>
		</CardContent>
	</Card>
</div>

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">
	all clips for {video.title}
</h1>

<div class="grid w-fit gap-4 pt-2 sm:grid-cols-1 md:grid-cols-3">
	{#each clips as clip (clip.id)}
		<ClipCard submissionsOpen={video.submissionsOpen} {clip} />
	{/each}
</div>
