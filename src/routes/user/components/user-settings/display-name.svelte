<script lang="ts">
  import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import Save from "@lucide/svelte/icons/save";
  import { useSession } from "$lib/session.svelte";
  import {
    createForm,
    Field,
    Form,
    reset,
    setErrors,
    type SubmitHandler,
  } from "@formisch/svelte";
  import * as v from "valibot";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import TextInput from "$lib/components/form/text-input.svelte";
  import { toast } from "svelte-sonner";
  import { watch } from "runed";

  const session = useSession();

  const formSchema = v.object({
    displayName: v.pipe(
      v.string("please provide a display name"),
      v.nonEmpty("please provide a display name"),
      v.minLength(4, "your display name has to be longer than 4 characters"),
      v.maxLength(48, "your display name has to be shorter than 48 characters"),
    ),
  });

  const form = createForm({
    schema: formSchema,
    initialInput: {
      displayName: session.current?.user.name,
    },
  });

  watch(
    () => session.current?.user.name,
    (name) => {
      reset(form, {
        initialInput: {
          displayName: name,
        },
      });
    },
  );

  const submitForm: SubmitHandler<typeof formSchema> = async (values) => {
    const res = await session.authClient.updateUser({
      name: values.displayName,
    });

    if (res.error) {
      setErrors(form, {
        path: ["displayName"],
        errors: [res.error.message || "unknown error"],
      });

      return;
    }

    toast.success("profile updated successfully", {
      position: "top-left",
    });
  };
</script>

<Card class="w-full max-w-xl">
  <CardHeader>
    <CardTitle>display name</CardTitle>
  </CardHeader>
  <CardContent class="flex gap-2">
    <Form of={form} onsubmit={submitForm}>
      <Field of={form} path={["displayName"]}>
        {#snippet children(field)}
          <TextInput
            {...field.props}
            input={field.input}
            errors={field.errors}
            type="text"
            placeholder="display name"
            required
          >
            {#snippet button()}
              <Button size="icon" type="submit" disabled={form.isSubmitting}>
                {#if form.isSubmitting}
                  <LoaderCircle class="animate-spin" />
                {:else}
                  <Save />
                {/if}
              </Button>
            {/snippet}
          </TextInput>
        {/snippet}
      </Field>
    </Form>
  </CardContent>
  <CardFooter>
    <p class="text-sm">
      this will be shown in the bottom right corner of videos, and in the end
      credits.
    </p>
  </CardFooter>
</Card>
