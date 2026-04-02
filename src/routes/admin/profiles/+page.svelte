<script lang="ts">
  import { resolve } from "$app/paths";
  import { getProfiles } from "$lib/api/profiles.remote";
  import { Button } from "$lib/components/ui/button/index.js";
  import {
    Alert,
    AlertTitle,
    AlertDescription,
  } from "$lib/components/ui/alert/index.js";
  import CircleAlert from "@lucide/svelte/icons/circle-alert";

  const promise = $derived(getProfiles());
  const profiles = $derived(await promise);

  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card/index.js";
</script>

<Button href={resolve("/admin")}>go back</Button>

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">admin / profiles</h1>

<h2 class="text-2xl font-bold tracking-tight md:text-3xl">all profiles</h2>

<Alert variant="warning">
  <CircleAlert />
  <AlertTitle>note</AlertTitle>
  <AlertDescription
    >as of right now, you can't edit or delete a profile. use drizzle studio to
    do that.</AlertDescription
  >
</Alert>

<div class="grid gap-4 pt-6 sm:grid-cols-1 md:grid-cols-2">
  {#each profiles as profile (profile.id)}
    <Card>
      <CardHeader>
        <CardTitle>profile {profile.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>line 1: {profile.line1}</p>
        <p>line 2: {profile.line2}</p>
      </CardContent>
    </Card>
  {:else}
    <p>no profiles</p>
  {/each}
</div>
