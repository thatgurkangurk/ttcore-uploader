<script lang="ts">
	import { getSubmissionsOpen, setSubmissionsOpen } from "$lib/api/video.remote";
	import { Button } from "./ui/button";

	const submissionsOpen = $derived(await getSubmissionsOpen());
</script>

<Button
	onclick={async () => {
		await setSubmissionsOpen({
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
