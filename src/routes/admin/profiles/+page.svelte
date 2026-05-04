<script lang="ts">
	import { resolve } from "$app/paths";
	import { getProfiles } from "$lib/api/profiles.remote";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Alert, AlertTitle, AlertDescription } from "$lib/components/ui/alert/index.js";
	import CircleAlert from "@lucide/svelte/icons/circle-alert";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card/index.js";
	import { createProfile } from "$lib/api/profiles.remote.js";
	import InputErrors from "$lib/components/form/input-errors.svelte";
	import { Input } from "$lib/components/ui/input";
	import Label from "$lib/components/ui/label/label.svelte";

	const promise = $derived(getProfiles());
	const profiles = $derived(await promise);

	function toErrors(arr: string[]): [string, ...string[]] | null {
		if (arr.length === 0) return null;

		const [first, ...rest] = arr;
		return [first, ...rest];
	}
</script>

<Button href={resolve("/admin")}>go back</Button>

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">admin / profiles</h1>

<h2 class="text-2xl font-bold tracking-tight md:text-3xl">all profiles</h2>

<Alert variant="warning">
	<CircleAlert />
	<AlertTitle>note</AlertTitle>
	<AlertDescription
		>as of right now, you can't edit or delete a profile. use drizzle studio to do that.</AlertDescription
	>
</Alert>

<div>
	<Card class="my-6 w-72">
		<CardHeader>
			<CardTitle>create a new profile</CardTitle>
		</CardHeader>
		<CardContent>
			<form {...createProfile}>
				<div>
					<Label class={[!!createProfile.fields.line1.issues() && "text-destructive", "pb-2"]}
						>line 1</Label
					>
					<Input
						{...createProfile.fields.line1.as("text")}
						aria-errormessage="{createProfile.fields.line1.as('text').name}-error"
						aria-invalid={!!createProfile.fields.line1.issues()}
					/>

					<InputErrors
						name={createProfile.fields.line1.as("text").name}
						errors={toErrors(
							createProfile.fields.line1.issues()?.map((value) => value.message) ?? []
						)}
					/>
				</div>

				<br />

				<div>
					<Label class={[!!createProfile.fields.line2.issues() && "text-destructive", "pb-2"]}
						>line 2</Label
					>
					<Input
						{...createProfile.fields.line2.as("text")}
						aria-errormessage="{createProfile.fields.line2.as('text').name}-error"
						aria-invalid={!!createProfile.fields.line2.issues()}
					/>

					<InputErrors
						name={createProfile.fields.line2.as("text").name}
						errors={toErrors(
							createProfile.fields.line2.issues()?.map((value) => value.message) ?? []
						)}
					/>
				</div>

				<br />
				<Button type="submit">create</Button>
			</form>
		</CardContent>
	</Card>
</div>

<div class="grid gap-4 pt-6 sm:grid-cols-1 md:grid-cols-2">
	{#each profiles as profile (profile.id)}
		<Card>
			<CardHeader>
				<CardTitle>profile {profile.id}</CardTitle>
			</CardHeader>
			<CardContent>
				<p>line 1: {profile.line1}</p>
				<p>line 2: {profile.line2}</p>
			</CardContent>
		</Card>
	{:else}
		<p>no profiles</p>
	{/each}
</div>
