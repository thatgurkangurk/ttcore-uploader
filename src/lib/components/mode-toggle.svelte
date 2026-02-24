<script lang="ts">
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";

	import { toggleMode } from "mode-watcher";
	import { Button } from "$lib/components/ui/button/index.js";
	import { setMode, mode } from "mode-watcher";

	function handleModeChange() {
		if (mode.current === "light") {
			setMode("dark");
		} else {
			if (confirm("are you SURE you want to hurt your own eyes like this?")) {
				alert("i could not live with myself if i allowed you to set it to light mode.");
			}
		}
	}
</script>

<Button onclick={handleModeChange} variant="outline" size="icon">
	<SunIcon
		class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
	/>
	<MoonIcon
		class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
	/>
	<span class="sr-only">Toggle theme</span>
</Button>
