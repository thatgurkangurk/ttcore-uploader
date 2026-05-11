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
	import { useSession } from "$lib/session.svelte";
	import { Alert, AlertDescription, AlertTitle } from "$lib/components/ui/alert";
	import CircleAlert from "@lucide/svelte/icons/circle-alert";

	let open = $state(false);
	const isDesktop = new MediaQuery("(min-width: 768px)");

	type Props = {
		clip: Clip;
	};

	let { clip }: Props = $props();

	const form = $derived(updateClip.for(clip.id));

	// svelte-ignore state_referenced_locally
	let songs = $state<string[]>([...clip.songs]);
	// svelte-ignore state_referenced_locally
	form.fields.songs.set(songs);

	watch(
		() => clip.songs,
		(newSongs) => {
			songs = newSongs;
		}
	);

	const session = useSession();

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
	{#if !(await getVideoById( { videoId: clip.videoId } )).submissionsOpen && session.current?.user.admin}
		<Alert variant="destructive">
			<CircleAlert />
			<AlertTitle>scary</AlertTitle>
			<AlertDescription>
				you are using super spooky scary admin powers to do this (the submissions are closed)
				<br />
				<br />
				scary i know
			</AlertDescription>
		</Alert>
	{/if}

	{#if clip.createdById !== session.current?.user.id && session.current?.user.admin}
		<Alert variant="destructive">
			<CircleAlert />
			<AlertTitle>scary</AlertTitle>
			<AlertDescription>
				you are using super spooky scary admin powers to do this (you don't own this clip)
				<br />
				<br />
				scary i know
			</AlertDescription>
		</Alert>
	{/if}

	<form
		{...form.preflight(UpdateClipArgs)}
		oninput={() => form.validate({ includeUntouched: false, preflightOnly: true })}
		enctype="multipart/form-data"
	>
		<input {...form.fields.clipId.as("hidden", clip.id)} />

		<div>
			<Label class={[!!form.fields.title.issues() && "text-destructive", "pb-2"]}>title</Label>
			<Input
				{...form.fields.title.as("text", clip.title)}
				aria-errormessage="{form.fields.title.as('text').name}-error"
				aria-invalid={!!form.fields.title.issues()}
				placeholder="my amazing clip"
			/>

			<InputErrors
				name={form.fields.title.as("text").name}
				errors={toErrors(form.fields.title.issues()?.map((value) => value.message) ?? [])}
			/>
		</div>
		<br />
		<div>
			<Label class={[!!form.fields.note.issues() && "text-destructive", "pb-2"]}
				>note (optional)</Label
			>
			<Textarea
				{...form.fields.note.as("text", clip.note ?? "")}
				aria-errormessage="{form.fields.note.as('text').name}-error"
				aria-invalid={!!form.fields.note.issues()}
				defaultValue={clip.note ?? ""}
			/>

			<InputErrors
				name={form.fields.note.as("text").name}
				errors={toErrors(form.fields.note.issues()?.map((value) => value.message) ?? [])}
			/>
		</div>

		<br />
		<br />

		<Label class="pb-2">songs used (in correct order, please!)</Label>

		<div {@attach autoAnimate({ duration: 150 })}>
			{#each songs, idx (idx)}
				<div class="py-2">
					<Label class={[!!form.fields.songs[idx].issues() && "text-destructive", "pb-2"]}>
						song {idx + 1}
					</Label>

					<ButtonGroup>
						<Input
							{...form.fields.songs[idx].as("text", songs[idx])}
							aria-errormessage="{form.fields.songs[idx].as('text').name}-error"
							aria-invalid={!!form.fields.songs[idx].issues()}
						/>

						<Button
							variant="destructive"
							type="button"
							disabled={!!form.pending}
							onclick={() => {
								removeSong(idx);
							}}
						>
							<Trash2 />
						</Button>
					</ButtonGroup>

					<InputErrors
						name={form.fields.songs[idx].as("text").name}
						errors={toErrors(form.fields.songs[idx].issues()?.map((value) => value.message) ?? [])}
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

		<Button type="submit" disabled={!!form.pending}>submit</Button>
	</form>
{/snippet}

{#if isDesktop.current}
	<Dialog.Root bind:open>
		<Dialog.Trigger
			disabled={session.current?.user.admin
				? false
				: !(await getVideoById({ videoId: clip.videoId })).submissionsOpen}
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
			disabled={session.current?.user.admin
				? false
				: !(await getVideoById({ videoId: clip.videoId })).submissionsOpen}
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
