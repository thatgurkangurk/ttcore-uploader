<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		AccordionContent,
		AccordionTrigger
	} from "$lib/components/ui/accordion/index.js";
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from "$lib/components/ui/card/index.js";
	import type { Clip } from "$lib/types/clip.js";
	import type { Snippet } from "svelte";

	type Props = {
		clip: Clip;
		footer?: Snippet;
	};

	let { clip, footer }: Props = $props();
</script>

<Card class="h-full w-full">
	<CardHeader>
		<CardTitle class="text-xl">{clip.title}</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="aspect-video w-full overflow-hidden rounded-lg">
			<!-- svelte-ignore a11y_media_has_caption -->
			<video class=" h-40 w-full object-cover" src={clip.url} controls preload="none"></video>
		</div>
	</CardContent>
	<CardFooter class="grid grid-cols-1 gap-1">
		<p>
			created by <span>{clip.creator!.name}</span>
		</p>

		{#if clip.note}
			<Accordion type="single">
				<AccordionItem value="item-1">
					<AccordionTrigger>note</AccordionTrigger>
					<AccordionContent class="whitespace-pre-wrap">
						{clip.note}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		{/if}

		<div class="flex flex-row gap-2">
			{@render footer?.()}
		</div>
		<p>
			clip id: <span>{clip.id}</span>
		</p>
	</CardFooter>
</Card>
