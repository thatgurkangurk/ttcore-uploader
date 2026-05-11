<script lang="ts">
	import {
		AlertDialog,
		AlertDialogTrigger,
		AlertDialogContent,
		AlertDialogTitle,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogAction,
		AlertDialogHeader,
		AlertDialogCancel
	} from "$lib/components/ui/alert-dialog/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import Star from "@lucide/svelte/icons/star";
	import { deleteClip, setClipSelected } from "$lib/api/clip.remote";
	import LoaderCircle from "@lucide/svelte/icons/loader-circle";
	import type { Clip } from "$lib/types/clip.js";
	import ClipCard from "$lib/components/clip-card.svelte";

	type Props = {
		clip: Clip;
		submissionsOpen: boolean;
	};

	let { clip, submissionsOpen }: Props = $props();

	let deleting = $state(false);
	let dialogOpen = $state(false);
</script>

<ClipCard {clip}>
	{#snippet footer()}
		<Button
			disabled={!submissionsOpen}
			onclick={async () =>
				await setClipSelected({
					clipId: clip.id,
					selected: !clip.selected
				})}
			variant="outline"
			size="icon"
		>
			<Star {...clip.selected ? { fill: "#ffffff" } : {}} />
		</Button>
		<AlertDialog bind:open={dialogOpen}>
			<AlertDialogTrigger
				disabled={!submissionsOpen}
				onclick={() => (dialogOpen = true)}
				class={buttonVariants({ variant: "destructive" })}
			>
				delete
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						are you sure you want to delete "{clip.title}"?
					</AlertDialogTitle>
					<AlertDialogDescription>
						this clip will permanently be gone. you probably should just unselect it
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onclick={() => (dialogOpen = false)}>no, cancel</AlertDialogCancel>
					<AlertDialogAction
						disabled={deleting}
						onclick={async () => {
							deleting = true;
							await deleteClip({ clipId: clip.id });
							deleting = false;
							dialogOpen = false;
						}}
					>
						{#if deleting}
							<LoaderCircle class="animate-spin" />
						{/if}
						yes, delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	{/snippet}
</ClipCard>
