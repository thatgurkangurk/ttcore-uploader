<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from "$lib/components/ui/card/index.js";
	import { createForm, Field, Form, reset, type SubmitHandler } from "@formisch/svelte";
	import SquarePen from "@lucide/svelte/icons/square-pen";
	import Save from "@lucide/svelte/icons/save";
	import * as v from "valibot";
	import { ClipTitleSchema } from "../../../../submit/schemas.js";
	import TextInput from "$lib/components/form/text-input.svelte";
	import { watch } from "runed";
	import { setNewClipTitle } from "$lib/api/clip.remote.js";
	import type { Clip } from "$lib/types/clip.js";

	type Props = {
		clip: Clip;
	};

	let { clip }: Props = $props();

	let titleEditMode = $state(false);

	const EditTitleSchema = v.object({
		title: ClipTitleSchema
	});

	watch(
		() => clip.title,
		(value) => {
			reset(editTitleForm, {
				initialInput: {
					title: value
				}
			});
		}
	);

	const editTitleForm = createForm({
		schema: EditTitleSchema,
		initialInput: {
			// eslint-disable-next-line svelte/no-unused-svelte-ignore
			// svelte-ignore state_referenced_locally its fine
			title: clip.title
		}
	});

	const submitEditTitleForm: SubmitHandler<typeof EditTitleSchema> = async (values) => {
		await setNewClipTitle({
			clipId: clip.id,
			title: values.title
		});
		titleEditMode = false;
	};
</script>

<Card class="h-full w-full">
	<CardHeader>
		<CardTitle class="text-xl">
			{#if titleEditMode}
				<Form of={editTitleForm} onsubmit={submitEditTitleForm}>
					<Field of={editTitleForm} path={["title"]}>
						{#snippet children(field)}
							<TextInput
								{...field.props}
								input={field.input}
								errors={field.errors}
								type="text"
								placeholder="my beautiful clip"
								required
							>
								{#snippet button()}
									<Button type="submit" disabled={editTitleForm.isSubmitting}>
										<Save />
									</Button>
								{/snippet}
							</TextInput>
						{/snippet}
					</Field>
				</Form>
			{:else}
				<div class="flex items-center justify-between gap-4">
					<span class="truncate">{clip.title}</span>

					<Button
						onclick={() => (titleEditMode = true)}
						size="icon-sm"
						variant="secondary"
						class="shrink-0"
					>
						<SquarePen />
					</Button>
				</div>
			{/if}
		</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="aspect-video w-full overflow-hidden rounded-lg">
			<!-- svelte-ignore a11y_media_has_caption -->
			<video class=" h-40 w-full object-cover" src={clip.url} controls preload="none"></video>
		</div>
	</CardContent>
	<CardFooter class="grid grid-cols-1 gap-1">
		<p>
			clip id: <span>{clip.id}</span>
		</p>
	</CardFooter>
</Card>
