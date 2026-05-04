<script lang="ts">
	import { resolve } from "$app/paths";
	import { createVideo, getVideos } from "$lib/api/video.remote";
	import InputErrors from "$lib/components/form/input-errors.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import Label from "$lib/components/ui/label/label.svelte";

	function toErrors(arr: string[]): [string, ...string[]] | null {
		if (arr.length === 0) return null;

		const [first, ...rest] = arr;
		return [first, ...rest];
	}

	const videos = $derived(await getVideos());
</script>

<Button href={resolve("/admin")}>go back</Button>

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">videos</h1>

<h2 class="text-2xl font-bold tracking-tight md:text-3xl">here are all the videos</h2>

<div>
	<h3 class="text-xl font-bold tracking-tight md:text-2xl">create a new video</h3>

	<Card class="my-6 w-72">
		<CardHeader>
			<CardTitle>create a new video</CardTitle>
		</CardHeader>
		<CardContent>
			<form {...createVideo}>
				<div>
					<Label class={[!!createVideo.fields.title.issues() && "text-destructive", "pb-2"]}
						>title</Label
					>
					<Input
						{...createVideo.fields.title.as("text")}
						aria-errormessage="{createVideo.fields.title.as('text').name}-error"
						aria-invalid={!!createVideo.fields.title.issues()}
					/>

					<InputErrors
						name={createVideo.fields.title.as("text").name}
						errors={toErrors(
							createVideo.fields.title.issues()?.map((value) => value.message) ?? []
						)}
					/>
				</div>

				<br />
				<Button type="submit">create</Button>
			</form>
		</CardContent>
	</Card>
</div>

<div class="flex w-fit flex-col gap-2">
	{#each videos as video}
		<Button
			href={resolve("/videos/[id]", {
				id: video.id
			})}>{video.title}</Button
		>
	{/each}
</div>
