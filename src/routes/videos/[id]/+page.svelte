<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import type { PageProps } from "./$types";
  import { getClipsForVideo, getVideoById } from "$lib/api/video.remote";
  import ToggleSubmissionsOpen from "$lib/components/toggle-submissions-open.svelte";
  import { resolve } from "$app/paths";
  import ClipCard from "./clip-card.svelte";

  let { params }: PageProps = $props();

  const videoPromise = $derived(
    getVideoById({
      videoId: params.id,
    }),
  );

  const clipsPromise = $derived(
    getClipsForVideo({
      videoId: params.id,
    }),
  );

  const video = $derived(await videoPromise);

  const clips = $derived(await clipsPromise);
</script>

<Button href={resolve("/videos")}>go back</Button>

<ToggleSubmissionsOpen videoId={video.id} />

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">
  all clips for {video.title}
</h1>

<div class="grid w-fit gap-4 pt-2 sm:grid-cols-1 md:grid-cols-3">
  {#each clips as clip}
    <ClipCard submissionsOpen={video.submissionsOpen} {clip} />
  {/each}
</div>
