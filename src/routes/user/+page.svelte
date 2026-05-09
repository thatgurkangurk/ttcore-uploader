<script lang="ts">
	import { useSession } from "$lib/session.svelte";
	import UserSettings from "./components/user-settings.svelte";
	import VideosWithMyClips from "./components/videos-with-my-clips.svelte";

	const session = useSession();
</script>

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">hello {session.current?.user.name}!</h1>

<br />

<VideosWithMyClips />

<UserSettings />
