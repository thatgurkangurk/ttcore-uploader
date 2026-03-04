<script lang="ts">
	import { getSubmissionsOpen, setSubmissionsOpen } from "$lib/api/video.remote";
	import { Button } from "./ui/button";

	type Props = {
		videoId: string;
	};

	let { videoId }: Props = $props();

	const submissionsOpen = $derived(
		await getSubmissionsOpen({
			videoId: videoId
		})
	);
</script>

<Button
	onclick={async () => {
		await setSubmissionsOpen({
			videoId: videoId,
			submissionsOpen: !submissionsOpen
		});
	}}
	variant={submissionsOpen ? "destructive" : "default"}
>
	{#if submissionsOpen}
		close submissions
	{:else}
		open submissions
	{/if}
</Button>
