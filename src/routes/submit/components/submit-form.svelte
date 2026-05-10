<script lang="ts">
	import { CreateNewClipArgs } from "../schemas";
	import { Button } from "$lib/components/ui/button";
	import { NativeSelect, NativeSelectOption } from "$lib/components/ui/native-select/index.js";
	import { createNewClip } from "$lib/api/clip.remote";
	import { Label } from "$lib/components/ui/label";
	import Trash2 from "@lucide/svelte/icons/trash-2";
	import { useSession } from "$lib/session.svelte";
	import { getProfiles } from "$lib/api/profiles.remote";
	import { getUsers } from "$lib/api/users.remote";
	import { ButtonGroup } from "$lib/components/ui/button-group/index.js";
	import { Input } from "$lib/components/ui/input";
	import InputErrors from "$lib/components/form/input-errors.svelte";
	import { toErrors } from "$lib/utils/to-errors";
	import Textarea from "$lib/components/ui/textarea/textarea.svelte";

	type Props = {
		videoId: string;
	};

	let { videoId }: Props = $props();

	const session = useSession();

	const adminDataPromise = $derived.by(async () => {
		if (session.current?.user.admin) {
			return Promise.all([getProfiles(), getUsers()]);
		}
		return [[], []];
	});

	const adminData = $derived(await adminDataPromise);

	const profiles = $derived(adminData[0]);
	const users = $derived(adminData[1]);

	const profileValues = $derived.by(() => {
		return profiles.map((profile) => ({
			value: profile.id,
			label: `${profile.line1} - ${profile.line2}`
		}));
	});

	const userValues = $derived.by(() => {
		return users.map((user) => ({
			value: user.id,
			label: `${user.name} - @${user.username}`
		}));
	});

	let songs = $state<string[]>([]);
	createNewClip.fields.songs.set(songs);

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

<br />

<p>
	if you do not have a direct video link, go here to upload one: <a
		class="underline underline-offset-4"
		href="https://www.image2url.com/video-to-url">https://www.image2url.com/video-to-url</a
	>
</p>

<br />

<p>please do not use discord cdn links, since they expire !</p>

<br />

<form
	{...createNewClip.preflight(CreateNewClipArgs)}
	oninput={() => createNewClip.validate({ includeUntouched: false })}
	enctype="multipart/form-data"
>
	<input {...createNewClip.fields.videoId.as("hidden", videoId)} />

	<div>
		<Label class={[!!createNewClip.fields.title.issues() && "text-destructive", "pb-2"]}
			>title</Label
		>
		<Input
			{...createNewClip.fields.title.as("text")}
			aria-errormessage="{createNewClip.fields.title.as('text').name}-error"
			aria-invalid={!!createNewClip.fields.title.issues()}
			placeholder="my amazing clip"
		/>

		<InputErrors
			name={createNewClip.fields.title.as("text").name}
			errors={toErrors(createNewClip.fields.title.issues()?.map((value) => value.message) ?? [])}
		/>
	</div>
	<br />
	<div>
		<Label class={[!!createNewClip.fields.url.issues() && "text-destructive", "pb-2"]}
			>direct link to a video</Label
		>
		<Input
			{...createNewClip.fields.url.as("url")}
			aria-errormessage="{createNewClip.fields.url.as('url').name}-error"
			aria-invalid={!!createNewClip.fields.url.issues()}
			placeholder="https://my.clip.host/clip.mp4"
		/>

		<InputErrors
			name={createNewClip.fields.url.as("url").name}
			errors={toErrors(createNewClip.fields.url.issues()?.map((value) => value.message) ?? [])}
		/>
	</div>
	<br />
	<div>
		<Label class={[!!createNewClip.fields.note.issues() && "text-destructive", "pb-2"]}
			>note (optional)</Label
		>
		<Textarea
			{...createNewClip.fields.note.as("text")}
			aria-errormessage="{createNewClip.fields.note.as('text').name}-error"
			aria-invalid={!!createNewClip.fields.note.issues()}
		/>

		<InputErrors
			name={createNewClip.fields.note.as("text").name}
			errors={toErrors(createNewClip.fields.note.issues()?.map((value) => value.message) ?? [])}
		/>
	</div>

	<br />
	<br />

	{#each songs, idx (idx)}
		<div class="py-2">
			<Label class={[!!createNewClip.fields.songs[idx].issues() && "text-destructive", "pb-2"]}>
				song {idx + 1}
			</Label>

			<ButtonGroup>
				<Input
					{...createNewClip.fields.songs[idx].as("text")}
					aria-errormessage="{createNewClip.fields.songs[idx].as('text').name}-error"
					aria-invalid={!!createNewClip.fields.songs[idx].issues()}
				/>
				<Button
					variant="destructive"
					type="submit"
					disabled={!!createNewClip.pending}
					onclick={() => {
						removeSong(idx);
					}}
				>
					<Trash2 />
				</Button>
			</ButtonGroup>

			<InputErrors
				name={createNewClip.fields.songs[idx].as("text").name}
				errors={toErrors(
					createNewClip.fields.songs[idx].issues()?.map((value) => value.message) ?? []
				)}
			/>
		</div>
	{/each}

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

	{#if session.current?.user.admin}
		<br />
		<br />

		<Label class="pb-2">select a profile override</Label>
		<div class="flex items-center gap-2">
			<NativeSelect {...createNewClip.fields.profileOverride.as("select")}>
				{#each profileValues as profile (profile.value)}
					<NativeSelectOption value={profile.value}>{profile.label}</NativeSelectOption>
				{/each}
			</NativeSelect>

			<Button
				onclick={() => createNewClip.fields.profileOverride.set(undefined)}
				variant="destructive"
				size="icon"
			>
				<Trash2 />
			</Button>
		</div>

		<Label class="pb-2">select a user override</Label>
		<div class="flex items-center gap-2">
			<NativeSelect {...createNewClip.fields.userOverride.as("select")}>
				{#each userValues as user (user.value)}
					<NativeSelectOption value={user.value}>{user.label}</NativeSelectOption>
				{/each}
			</NativeSelect>

			<Button
				onclick={() => createNewClip.fields.userOverride.set(undefined)}
				variant="destructive"
				size="icon"
			>
				<Trash2 />
			</Button>
		</div>
	{/if}

	<Button type="submit">submit</Button>
</form>
