<script lang="ts">
  import { useSession } from "$lib/session.svelte";
  import ModeToggle from "./mode-toggle.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { page } from "$app/state";

  const session = useSession();
</script>

{#snippet navLink(to: string, label: string)}
  {@const active = page.url.pathname === to}
  <Button
    variant="link"
    class={["p-0", active ? "text-primary underline" : "text-white"]}
    href={to}>{label}</Button
  >
{/snippet}

<div class="flex flex-row items-center gap-3">
  <ModeToggle />

  {@render navLink("/", "home")}
  {@render navLink("/submit", "submit")}

  {#if session.current?.user.admin}
    {@render navLink("/admin", "admin")}
  {/if}

  |

  {#if session.current?.user}
    <p>hi, {session.current.user.name}!</p>
    {@render navLink("/user", "settings")}
    <Button class="pl-0" variant="link" onclick={() => session.signOut()}
      >sign out</Button
    >
  {:else}
    <Button
      class="pl-0"
      variant="link"
      onclick={() => session.signInSocial("discord")}
      >sign in with Discord</Button
    >
  {/if}
</div>
