<script lang="ts">
	import * as v from "valibot";
	import { createForm, Field, Form, reset, type SubmitHandler } from "@formisch/svelte";
	import TextInput from "$lib/components/form/text-input.svelte";
	import { Button } from "$lib/components/ui/button";
	import LoaderCircle from "@lucide/svelte/icons/loader-circle";
	import { toast } from "svelte-sonner";

	const formSchema = v.object({
		url: v.pipe(
			v.string("please provide a url"),
			v.url("please provide a valid url"),
			v.check((value) => {
				try {
					const parsed = new URL(value);
					return parsed.hostname === "medal.tv";
				} catch {
					return false;
				}
			}, "please provide a medal link")
		)
	});

	const form = createForm({
		schema: formSchema
	});

	const submitForm: SubmitHandler<typeof formSchema> = async (output) => {
		try {
			const res = await fetch(`/api/download-video?videoUrl=${encodeURIComponent(output.url)}`);
			if (!res.ok) throw new Error("network response was not ok");

			const blob = await res.blob();
			const blobUrl = window.URL.createObjectURL(blob);

			const a = document.createElement("a");
			a.style.display = "none";
			a.href = blobUrl;
			a.download = "video.mp4";

			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);

			window.URL.revokeObjectURL(blobUrl);

			reset(form);

			toast.success("downloaded", {
				position: "top-left"
			});
		} catch (err) {
			if (err instanceof Error) {
				alert(err.message);
			} else {
				alert("unknown error");
			}
		}
	};
</script>

<Form of={form} onsubmit={submitForm}>
	<Field of={form} path={["url"]}>
		{#snippet children(field)}
			<TextInput
				{...field.props}
				input={field.input}
				errors={field.errors}
				type="text"
				label="medal clip link"
				placeholder="https://medal.tv/..."
				required
			/>
		{/snippet}
	</Field>
	<br />
	<Button
		class="w-fit"
		disabled={!form.isDirty || !form.isValid || form.isSubmitting}
		type="submit"
	>
		{#if form.isSubmitting}
			<LoaderCircle class="animate-spin" />
		{/if}
		download
	</Button>
</Form>
