<script lang="ts">
	import { MediaQuery } from "svelte/reactivity";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import type { Clip } from "$lib/types/clip.js";
	import { autoAnimate } from "$lib/attachments/auto-animate.svelte.js";
	import Trash2 from "@lucide/svelte/icons/trash-2";
	import { updateClip } from "$lib/api/clip.remote.js";
	import { getVideoById } from "$lib/api/video.remote.js";
	import { UpdateClipArgs } from "$lib/schemas/clip";
	import { Input } from "$lib/components/ui/input";
	import InputErrors from "$lib/components/form/input-errors.svelte";
	import { toErrors } from "$lib/utils/to-errors";
	import { Textarea } from "$lib/components/ui/textarea";
	import { ButtonGroup } from "$lib/components/ui/button-group";
	import { watch } from "runed";

	let open = $state(false);
	const isDesktop = new MediaQuery("(min-width: 768px)");

	type Props = {
		clip: Clip;
	};

	let { clip }: Props = $props();

	// svelte-ignore state_referenced_locally
	let songs = $state<string[]>(clip.songs);
	// svelte-ignore state_referenced_locally
	updateClip.fields.songs.set(songs);

	watch(
		() => clip.songs,
		(newSongs) => {
			songs = newSongs;
		}
	);

	function addSong() {
		if (songs.length >= 12) return;
		songs.push("");
	}

	function removeSong(indexToRemove: number) {
		songs.splice(indexToRemove, 1);
	}

	function removeAllSongs() {
		songs.length = 0;
	}
</script>

{#snippet content()}
	<form
		{...updateClip.preflight(UpdateClipArgs)}
		oninput={() => updateClip.validate({ includeUntouched: false, preflightOnly: true })}
		enctype="multipart/form-data"
	>
		<input {...updateClip.fields.clipId.as("hidden", clip.id)} />

		<div>
			<Label class={[!!updateClip.fields.title.issues() && "text-destructive", "pb-2"]}>title</Label
			>
			<Input
				{...updateClip.fields.title.as("text", clip.title)}
				aria-errormessage="{updateClip.fields.title.as('text').name}-error"
				aria-invalid={!!updateClip.fields.title.issues()}
				placeholder="my amazing clip"
			/>

			<InputErrors
				name={updateClip.fields.title.as("text").name}
				errors={toErrors(updateClip.fields.title.issues()?.map((value) => value.message) ?? [])}
			/>
		</div>
		<br />
		<div>
			<Label class={[!!updateClip.fields.note.issues() && "text-destructive", "pb-2"]}
				>note (optional)</Label
			>
			<Textarea
				{...updateClip.fields.note.as("text", clip.note ?? "")}
				aria-errormessage="{updateClip.fields.note.as('text').name}-error"
				aria-invalid={!!updateClip.fields.note.issues()}
				defaultValue={clip.note ?? ""}
			/>

			<InputErrors
				name={updateClip.fields.note.as("text").name}
				errors={toErrors(updateClip.fields.note.issues()?.map((value) => value.message) ?? [])}
			/>
		</div>

		<br />
		<br />

		<Label class="pb-2">songs used (in correct order, please!)</Label>

		<div {@attach autoAnimate({ duration: 150 })}>
			{#each songs, idx (idx)}
				<div class="py-2">
					<Label class={[!!updateClip.fields.songs[idx].issues() && "text-destructive", "pb-2"]}>
						song {idx + 1}
					</Label>

					<ButtonGroup>
						<Input
							{...updateClip.fields.songs[idx].as("text", clip.songs[idx])}
							aria-errormessage="{updateClip.fields.songs[idx].as('text').name}-error"
							aria-invalid={!!updateClip.fields.songs[idx].issues()}
						/>

						<Button
							variant="destructive"
							type="button"
							disabled={!!updateClip.pending}
							onclick={() => {
								removeSong(idx);
							}}
						>
							<Trash2 />
						</Button>
					</ButtonGroup>

					<InputErrors
						name={updateClip.fields.songs[idx].as("text").name}
						errors={toErrors(
							updateClip.fields.songs[idx].issues()?.map((value) => value.message) ?? []
						)}
					/>
				</div>
			{/each}
		</div>

		<Button type="button" disabled={songs.length >= 12} onclick={addSong}>add song</Button>

		<Button
			type="button"
			variant="destructive"
			disabled={songs.length === 0}
			onclick={removeAllSongs}
		>
			remove all songs
		</Button>

		<br />

		<Button type="submit" disabled={!!updateClip.pending}>submit</Button>
	</form>
{/snippet}

{#if isDesktop.current}
	<Dialog.Root bind:open>
		<Dialog.Trigger
			disabled={!(await getVideoById({ videoId: clip.videoId })).submissionsOpen}
			class={buttonVariants({ variant: "outline" })}>edit</Dialog.Trigger
		>
		<Dialog.Content class="sm:max-w-106.25">
			<Dialog.Header>
				<Dialog.Title>edit "{clip.title}"</Dialog.Title>
				<Dialog.Description>
					edit the clip details here. click save when you're done
				</Dialog.Description>
			</Dialog.Header>
			{@render content()}
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Trigger
			disabled={!(await getVideoById({ videoId: clip.videoId })).submissionsOpen}
			class={buttonVariants({ variant: "outline" })}>edit</Drawer.Trigger
		>
		<Drawer.Content>
			<Drawer.Header class="text-start">
				<Drawer.Title>edit "{clip.title}"</Drawer.Title>
				<Drawer.Description>
					edit the clip details here. click save when you're done
				</Drawer.Description>
			</Drawer.Header>
			{@render content()}
			<Drawer.Footer class="pt-2">
				<Drawer.Close class={buttonVariants({ variant: "outline" })}>Cancel</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
