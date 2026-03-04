<script lang="ts">
	import { createForm, Field, Form, reset, type SubmitHandler } from "@formisch/svelte";
	import { CreateNewClipSchema } from "../schemas";
	import TextInput from "$lib/components/form/text-input.svelte";
	import { Button } from "$lib/components/ui/button";
	import LoaderCircle from "@lucide/svelte/icons/loader-circle";
	import { createNewClip } from "$lib/api/clip.remote";

	type Props = {
		videoId: string;
	};

	let { videoId }: Props = $props();

	const form = createForm({
		schema: CreateNewClipSchema
	});

	const submitForm: SubmitHandler<typeof CreateNewClipSchema> = async (output) => {
		await createNewClip({
			videoId: videoId,
			title: output.title,
			url: output.url
		}).catch((err) => {
			if (err instanceof Error) {
				alert(err.message);
			}

			alert("unknown error");
		});

		reset(form);
	};
</script>

<br />

<p>
	if you do not have a direct video link, go here to upload one: <a
		href="https://www.image2url.com/video-to-url">https://www.image2url.com/video-to-url</a
	>
</p>

<br />

<p>please do not use discord cdn links, since they expire !</p>

<br />

<Form of={form} onsubmit={submitForm}>
	<Field of={form} path={["title"]}>
		{#snippet children(field)}
			<TextInput
				{...field.props}
				input={field.input}
				errors={field.errors}
				type="text"
				label="title"
				placeholder="my amazing clip"
				required
			/>
		{/snippet}
	</Field>
	<br />
	<Field of={form} path={["url"]}>
		{#snippet children(field)}
			<TextInput
				{...field.props}
				input={field.input}
				errors={field.errors}
				type="text"
				label="direct link to a video"
				placeholder="https://my.clip.host/clip.mp4"
				required
			/>
		{/snippet}
	</Field>

	<br />

	<Button
		class="w-fit"
		disabled={!form.isDirty || !form.isValid || form.isSubmitting}
		type="submit"
	>
		{#if form.isSubmitting}
			<LoaderCircle class="animate-spin" />
		{/if}
		submit
	</Button>
</Form>
