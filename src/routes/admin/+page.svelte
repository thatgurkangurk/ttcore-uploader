<script lang="ts">
  import { resolve } from "$app/paths";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<Button href={resolve("/")}>go back</Button>

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">admin</h1>

<h2 class="text-2xl font-bold tracking-tight md:text-3xl">
  here are the admin pages
</h2>

<div class="grid w-fit gap-4">
  <Button href={resolve("/admin/profiles")}>profiles</Button>
  <Button href={resolve("/videos")}>videos</Button>
</div>
