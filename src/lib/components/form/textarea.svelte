<script lang="ts">
	import type { FieldElementProps } from "@formisch/svelte";
	import InputErrors from "./input-errors.svelte";
	import { Label } from "../ui/label";
	import { Textarea } from "../ui/textarea";

	type Props = {
		class?: string;
		type: "text" | "email" | "tel" | "password" | "url" | "number" | "date";
		label?: string;
		placeholder?: string;
		required?: boolean;
		input: string | number | undefined;
		errors: [string, ...string[]] | null;
	} & FieldElementProps;

	let {
		class: className,
		label,
		name,
		required,
		input,
		errors,
		type,
		...fieldProps
	}: Props = $props();

	let value: string | number | undefined = $derived(
		type === "number" && typeof input === "string" ? Number(input) : input
	);
</script>

<div class={[className]}>
	<Label class={[!!errors && "text-destructive", "pb-2"]} for={name}>{label}</Label>

	<Textarea
		{...fieldProps}
		id={name}
		{name}
		{value}
		{required}
		aria-invalid={!!errors}
		aria-errormessage={`${name}-error`}
	/>

	<InputErrors {name} {errors} />
</div>
