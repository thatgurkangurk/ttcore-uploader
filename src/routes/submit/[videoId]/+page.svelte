<script lang="ts">
  import { resolve } from "$app/paths";
  import { Button } from "$lib/components/ui/button/index.js";
  import SubmitForm from "../components/submit-form.svelte";
  import type { PageProps } from "./$types";
  import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "$lib/components/ui/alert/index.js";
  import CircleQuestionMark from "@lucide/svelte/icons/circle-question-mark";
  import MedalDownloader from "$lib/components/medal-downloader.svelte";

  let { data }: PageProps = $props();
</script>

<Button href={resolve("/submit")}>go back</Button>

{#if data.details.submissionsOpen}
  <h1 class="text-2xl font-bold tracking-tight md:text-3xl">
    please submit your videos for {data.details.title}
  </h1>

  <Alert>
    <CircleQuestionMark />
    <AlertTitle>do you have a clip on medal?</AlertTitle>
    <AlertDescription>
      use this to download it

      <div class="text-white py-2">
        <MedalDownloader />
      </div>
    </AlertDescription>
  </Alert>

  <SubmitForm videoId={data.details.id} />
{:else}
  <h1 class="text-3xl font-bold tracking-tight md:text-4xl">
    sorry, but submissions are not open at the moment, please check back later !
  </h1>

  {#if data.submitters.length > 0}
    <br />
    <p class="font-bold">
      but thank you to all of these amazing people who submitted for {data
        .details.title}:
    </p>

    <ul class="pl-2">
      {#each data.submitters as submitter (submitter.id)}
        <li class={[submitter.isOverridden && "italic"]}>
          {submitter.line1} -
          <span>{submitter.line2}</span>
        </li>
      {/each}
    </ul>
  {/if}
{/if}
