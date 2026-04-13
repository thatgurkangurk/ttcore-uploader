<script lang="ts">
  import { useSession } from "$lib/session.svelte";
  import UserSettings from "./components/user-settings.svelte";

  const session = useSession();
</script>

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">user settings</h1>

<h2 class="text-2xl font-bold tracking-tight md:text-3xl">
  hello {session.current?.user.name}!
</h2>

<br />

<UserSettings />
