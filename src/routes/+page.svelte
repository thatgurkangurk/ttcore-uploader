<script>
	import { Button } from "$lib/components/ui/button/index.js";
</script>

<div class="grid items-center gap-12 md:grid-cols-2">
	<div class="space-y-6">
		<h1 class="text-4xl font-bold tracking-tight md:text-6xl">ttcore submitter</h1>

		<p class="text-lg text-gray-300 md:text-xl">please submit clips here !</p>

		<Button size="lg" variant="secondary" href="/submit">submit a clip!</Button>
	</div>

	<div class="flex justify-center md:justify-end">
		<enhanced:img
			src="$lib/assets/we-want-you.png"
			alt="We want you"
			class="w-full max-w-md object-contain"
		/>
	</div>
</div>
