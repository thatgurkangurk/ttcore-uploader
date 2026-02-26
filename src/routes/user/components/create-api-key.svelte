<script lang="ts" module>
	import * as v from "valibot";

	const CreateNewApiKeySchema = v.object({
		name: v.pipe(
			v.string("please provide a name"),
			v.minLength(4, "the name has to be longer than 4 characters"),
			v.maxLength(24, "the name has to be shorter than 24 characters")
		)
	});
</script>

<script lang="ts">
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Modal from "$lib/components/ui/modal";
	import type { Awaitable } from "better-auth";
	import { createForm, Field, Form, setErrors, submit, type SubmitHandler } from "@formisch/svelte";
	import { useSession } from "$lib/session.svelte";
	import TextInput from "$lib/components/form/text-input.svelte";
	import LoaderCircle from "@lucide/svelte/icons/loader-circle";
	import { toast } from "svelte-sonner";

	type Props = {
		oncreate: () => Awaitable<void>;
	};

	let { oncreate }: Props = $props();

	let modalOpen = $state(false);

	const form = createForm({
		schema: CreateNewApiKeySchema
	});

	const session = useSession();

	const submitForm: SubmitHandler<typeof CreateNewApiKeySchema> = async (output) => {
		const { data, error } = await session.authClient.apiKey.create({
			name: output.name
		});

		if (error) {
			setErrors(form, {
				path: ["name"],
				errors: ["something went wrong"]
			});

			console.error(error.message);
		}

		modalOpen = false;

		navigator.clipboard.writeText(data?.key || "");

		toast.success("the API key is copied to your clipboard");

		oncreate();
	};
</script>

<Modal.Root bind:open={modalOpen}>
	<Modal.Trigger class={buttonVariants()}>create a new api key</Modal.Trigger>

	<Modal.Content>
		<Form of={form} onsubmit={submitForm}>
			<Modal.Header>
				<Modal.Title>create a new api key</Modal.Title>
				<Modal.Description>please fill out this form to create a new api key</Modal.Description>
			</Modal.Header>

			<Field of={form} path={["name"]}>
				{#snippet children(field)}
					<TextInput
						{...field.props}
						input={field.input}
						errors={field.errors}
						type="text"
						label="name"
						placeholder="my beautiful api key"
						required
					/>
				{/snippet}
			</Field>

			<Modal.Footer class="grid grid-cols-2 py-2">
				<Button type="submit" disabled={!form.isDirty || !form.isValid || form.isSubmitting}>
					{#if form.isSubmitting}
						<LoaderCircle class="animate-spin" />
					{/if}
					submit
				</Button>
				<Button type="button" variant="secondary" onclick={() => (modalOpen = false)}>close</Button>
			</Modal.Footer>
		</Form>
	</Modal.Content>
</Modal.Root>
