<script lang="ts">
	import { MediaQuery } from "svelte/reactivity";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as v from "valibot";
	import { SongsSchema } from "../../../../submit/schemas.js";
	import type { Clip } from "$lib/types/clip.js";
	import {
		createForm,
		Field,
		FieldArray,
		Form,
		insert,
		remove,
		reset,
		type SubmitHandler
	} from "@formisch/svelte";
	import TextInput from "$lib/components/form/text-input.svelte";
	import { autoAnimate } from "$lib/attachments/auto-animate.svelte.js";
	import Trash2 from "@lucide/svelte/icons/trash-2";
	import { setNewClipSongs } from "$lib/api/clip.remote.js";
	import { watch } from "runed";

	let open = $state(false);
	const isDesktop = new MediaQuery("(min-width: 768px)");

	type Props = {
		clip: Clip;
	};

	let { clip }: Props = $props();

	const schema = v.object({
		songs: SongsSchema
	});

	const form = createForm({
		schema,
		initialInput: {
			// eslint-disable-next-line svelte/no-unused-svelte-ignore
			// svelte-ignore state_referenced_locally its fine
			songs: clip.songs
		}
	});

	watch(
		() => clip.songs,
		(value) => {
			reset(form, {
				initialInput: {
					songs: value
				}
			});
		}
	);

	const submitForm: SubmitHandler<typeof schema> = async (values) => {
		await setNewClipSongs({
			clipId: clip.id,
			songs: values.songs
		});
		open = false;
	};
</script>

{#snippet content()}
	<Form of={form} onsubmit={submitForm}>
		<FieldArray of={form} path={["songs"]}>
			{#snippet children(fieldArray)}
				{@const songCount = fieldArray.items.length}

				<Label class="pb-2">songs used (in correct order, please!)</Label>
				<div {@attach autoAnimate({ duration: 150 })}>
					{#each fieldArray.items as item, index (item)}
						<div class="py-2">
							<Field of={form} path={["songs", index]}>
								{#snippet children(field)}
									<TextInput
										{...field.props}
										input={field.input}
										errors={field.errors}
										type="text"
										label="song {index + 1}"
										placeholder="artist - song title"
										required
									>
										{#snippet button()}
											<Button
												size="icon"
												variant="destructive"
												type="submit"
												disabled={form.isSubmitting}
												onclick={() => {
													remove(form, {
														path: ["songs"],
														at: index
													});
												}}
											>
												<Trash2 />
											</Button>
										{/snippet}
									</TextInput>
								{/snippet}
							</Field>
						</div>
					{/each}
				</div>

				<Button
					disabled={songCount >= 12}
					onclick={() =>
						insert(form, {
							path: ["songs"],
							initialInput: ""
						})}
				>
					add song
				</Button>
				<Button
					variant="destructive"
					disabled={songCount === 0}
					onclick={() =>
						reset(form, {
							path: ["songs"],
							initialInput: []
						})}
				>
					remove all songs
				</Button>
			{/snippet}
		</FieldArray>
		<br />
		<br />
		<Button type="submit" disabled={form.isSubmitting}>save</Button>
	</Form>
{/snippet}

{#if isDesktop.current}
	<Dialog.Root bind:open>
		<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>edit songs</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-106.25">
			<Dialog.Header>
				<Dialog.Title>Edit profile</Dialog.Title>
				<Dialog.Description>
					Make changes to your profile here. Click save when you're done.
				</Dialog.Description>
			</Dialog.Header>
			{@render content()}
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Trigger class={buttonVariants({ variant: "outline" })}>edit songs</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header class="text-start">
				<Drawer.Title>Edit profile</Drawer.Title>
				<Drawer.Description>
					Make changes to your profile here. Click save when you're done.
				</Drawer.Description>
			</Drawer.Header>
			{@render content()}
			<Drawer.Footer class="pt-2">
				<Drawer.Close class={buttonVariants({ variant: "outline" })}>Cancel</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
