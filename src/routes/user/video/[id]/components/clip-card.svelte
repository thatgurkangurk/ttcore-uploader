<script lang="ts">
	import type { Clip } from "$lib/types/clip.js";
	import EditClip from "./edit-clip.svelte";
	import ClipCard from "$lib/components/clip-card.svelte";

	type Props = {
		clip: Clip;
	};

	let { clip }: Props = $props();
</script>

<ClipCard {clip}>
	{#snippet footer()}
		<EditClip {clip} />
	{/snippet}
</ClipCard>
