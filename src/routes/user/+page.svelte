<script lang="ts">
	import { resource } from "runed";
	import { useSession } from "$lib/session.svelte";
	import CreateApiKey from "./components/create-api-key.svelte";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import Trash2 from "@lucide/svelte/icons/trash-2";

	const session = useSession();

	const apiKeysResource = resource(
		() => session.current?.user,
		async () => {
			return await session.authClient.apiKey.list();
		}
	);
</script>

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">user settings</h1>

<h2 class="text-2xl font-bold tracking-tight md:text-3xl">hello {session.current?.user.name}!</h2>

<br />

<h3 class="text-xl font-bold tracking-tight md:text-2xl">api keys</h3>

{#if apiKeysResource.loading}
	<p>loading api keys...</p>
{:else if apiKeysResource.error}
	<p>error: {apiKeysResource.error.message}</p>
{:else}
	<p>your api keys</p>

	<div class="grid grid-cols-1 gap-4">
		{#each apiKeysResource.current?.data || [] as apiKey (apiKey.id)}
			<div class="flex flex-row items-center gap-2">
				<p>{apiKey.name} - {apiKey.start}...</p>
				<AlertDialog.Root>
					<AlertDialog.Trigger class={buttonVariants({ variant: "destructive", size: "icon" })}>
						<Trash2 />
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title
								>are you sure you want to delete this api key ({apiKey.name})?</AlertDialog.Title
							>
							<AlertDialog.Description>this api key will become unusable</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<AlertDialog.Action
								onclick={async () => {
									await session.authClient.apiKey.delete({
										keyId: apiKey.id
									});

									await apiKeysResource.refetch();
								}}
								class={buttonVariants({ variant: "destructive" })}>Continue</AlertDialog.Action
							>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</div>
		{/each}
	</div>

	<CreateApiKey
		oncreate={async () => {
			await apiKeysResource.refetch();
		}}
	/>
{/if}
