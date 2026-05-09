<script lang="ts">
	import { resolve } from "$app/paths";
	import { getVideosWithMySubmissions } from "$lib/api/video.remote";
	import { Button } from "$lib/components/ui/button/index.js";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from "$lib/components/ui/card";
</script>

<Card>
	<CardHeader>
		<CardTitle>my clips</CardTitle>
		<CardDescription>use this to edit/view your submitted clips</CardDescription>
	</CardHeader>

	<CardContent>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each await getVideosWithMySubmissions() as video (video.id)}
				<Button
					class="h-auto py-2 text-center wrap-break-word whitespace-normal"
					href={resolve("/user/video/[id]", {
						id: video.id
					})}
				>
					{video.title}
				</Button>
			{:else}
				<p>you haven't submitted any clips yet</p>
			{/each}
		</div>
	</CardContent>
</Card>
