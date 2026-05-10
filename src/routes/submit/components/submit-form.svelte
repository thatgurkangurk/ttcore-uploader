<script lang="ts">
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
	import { CreateNewClipSchema } from "../schemas";
	import TextInput from "$lib/components/form/text-input.svelte";
	import { Button } from "$lib/components/ui/button";
	import LoaderCircle from "@lucide/svelte/icons/loader-circle";
	import { createNewClip } from "$lib/api/clip.remote";
	import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectLabel,
		SelectTrigger
	} from "$lib/components/ui/select/index.js";
	import { Label } from "$lib/components/ui/label";
	import Trash2 from "@lucide/svelte/icons/trash-2";
	import { useSession } from "$lib/session.svelte";
	import { getProfiles } from "$lib/api/profiles.remote";
	import { getUsers } from "$lib/api/users.remote";
	import { autoAnimate } from "$lib/attachments/auto-animate.svelte";
	import Textarea from "$lib/components/form/textarea.svelte";

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

	const form = createForm({
		schema: CreateNewClipSchema
	});

	const submitForm: SubmitHandler<typeof CreateNewClipSchema> = async (output) => {
		try {
			await createNewClip({
				videoId: videoId,
				title: output.title,
				url: output.url,
				profileOverride: output.profileOverride,
				userOverride: output.userOverride,
				songs: output.songs,
				note: output.note
			});

			reset(form);
		} catch (err) {
			if (err instanceof Error) {
				alert(err.message);
			} else {
				alert("unknown error");
			}
		}
	};
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

	<Field of={form} path={["note"]}>
		{#snippet children(field)}
			<Textarea
				{...field.props}
				input={field.input}
				errors={field.errors}
				type="text"
				label="note (optional)"
				placeholder="..."
				required
			/>
		{/snippet}
	</Field>

	<br />

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

	{#if session.current?.user.admin}
		<br />
		<br />

		<Field of={form} path={["profileOverride"]}>
			{#snippet children(field)}
				<Label class="pb-2">select a profile override</Label>
				<div class="flex items-center gap-2">
					<Select
						type="single"
						{...field.props}
						value={field.input || undefined}
						onValueChange={field.onInput}
					>
						<SelectTrigger class="w-fit"
							>{profileValues.find((f) => f.value === field.input)?.label ??
								"select a profile override"}</SelectTrigger
						>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>profiles (line 1) - (line 2)</SelectLabel>
								{#each profileValues as profile (profile.value)}
									<SelectItem value={profile.value} label={profile.label}>
										{profile.label}
									</SelectItem>
								{/each}
							</SelectGroup>
						</SelectContent>
					</Select>
					<Button
						onclick={() =>
							reset(form, {
								path: ["profileOverride"]
							})}
						variant="destructive"
						size="icon"
					>
						<Trash2 />
					</Button>
				</div>
			{/snippet}
		</Field>

		<br />

		<Field of={form} path={["userOverride"]}>
			{#snippet children(field)}
				<Label class="pb-2">select a user override</Label>
				<div class="flex items-center gap-2">
					<Select
						type="single"
						{...field.props}
						value={field.input || undefined}
						onValueChange={field.onInput}
					>
						<SelectTrigger class="w-fit"
							>{userValues.find((f) => f.value === field.input)?.label ??
								"select a user override"}</SelectTrigger
						>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>users (display name) - (username)</SelectLabel>
								{#each userValues as user (user.value)}
									<SelectItem value={user.value} label={user.label}>
										{user.label}
									</SelectItem>
								{/each}
							</SelectGroup>
						</SelectContent>
					</Select>
					<Button
						onclick={() =>
							reset(form, {
								path: ["userOverride"]
							})}
						variant="destructive"
						size="icon"
					>
						<Trash2 />
					</Button>
				</div>
			{/snippet}
		</Field>
	{/if}

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
