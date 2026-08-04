<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import { Button } from "$lib/components/ui/button/index.js";
	import { ModeWatcher } from "mode-watcher";
	import { ExternalLink} from "@lucide/svelte"
</script>

<svelte:head><link rel="icon" href={favicon} /> <title>we've moved! - ttcore submitter</title></svelte:head>
<ModeWatcher defaultMode="dark" />

<div class="min-h-screen p-4">
    <section class="flex min-h-[calc(100vh-2rem)] w-full items-center justify-center rounded-xl bg-gray-950 pb-20 pt-12 text-white">
        <div class="w-full max-w-7xl -translate-y-6 px-6">
             <div class="grid items-center gap-12 md:grid-cols-2">
                <div class="space-y-6 text-center md:text-left">
                       <h1 class="text-4xl font-bold tracking-tight md:text-6xl">we've moved!</h1>

                       <p class="text-lg text-gray-300 md:text-xl">please submit clips here !</p>

                       <div>
                           <Button size="lg" variant="secondary" href="https://www.gurkz.me/ttcore"><ExternalLink /> to the new submitter</Button>
                       </div>
                </div>

                <div class="flex justify-center md:justify-end">
                       <enhanced:img
                          src="$lib/assets/we-want-you.png"
                          alt="We want you"
                          class="w-full max-w-md object-contain"
                       />
                </div>
             </div>
        </div>
    </section>
</div>
