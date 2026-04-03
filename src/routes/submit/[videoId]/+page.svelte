<script lang="ts">
  import { resolve } from "$app/paths";
  import { getProfiles } from "$lib/api/profiles.remote";
  import { GURKANS_USER_ID } from "$lib/api/utils";
  import { Button } from "$lib/components/ui/button/index.js";
  import { useSession } from "$lib/session.svelte";
  import SubmitForm from "../components/submit-form.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const session = useSession();

  const promise = $derived.by(async () => {
    if (session.current?.user.id === GURKANS_USER_ID) {
      return await getProfiles();
    }

    return [];
  });

  const profiles = $derived(await promise);
</script>

<Button href={resolve("/submit")}>go back</Button>

{#if data.details.submissionsOpen}
  <h1 class="text-2xl font-bold tracking-tight md:text-3xl">
    please submit your videos for {data.details.title}
  </h1>

  <SubmitForm {profiles} videoId={data.details.id} />
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
