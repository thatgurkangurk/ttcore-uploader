<script lang="ts" module>
</script>

<script lang="ts">
  import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import {
    createForm,
    Field,
    Form,
    reset,
    setErrors,
    type SubmitHandler,
  } from "@formisch/svelte";
  import { useSession } from "$lib/session.svelte";
  import TextInput from "$lib/components/form/text-input.svelte";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { toast } from "svelte-sonner";
  import { Separator } from "$lib/components/ui/separator";
  import { resource } from "runed";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import * as v from "valibot";

  const CreateNewApiKeySchema = v.object({
    name: v.pipe(
      v.string("please provide a name"),
      v.minLength(4, "the name has to be longer than 4 characters"),
      v.maxLength(24, "the name has to be shorter than 24 characters"),
    ),
  });

  const form = createForm({
    schema: CreateNewApiKeySchema,
  });

  const session = useSession();

  const apiKeysResource = resource(
    () => session.current?.user,
    async () => {
      return await session.authClient.apiKey.list();
    },
  );

  const submitForm: SubmitHandler<typeof CreateNewApiKeySchema> = async (
    output,
  ) => {
    const { data, error } = await session.authClient.apiKey.create({
      name: output.name,
    });

    if (error) {
      setErrors(form, {
        path: ["name"],
        errors: ["something went wrong"],
      });

      console.error(error.message);
    }

    navigator.clipboard.writeText(data?.key || "");

    toast.success("the API key is copied to your clipboard");

    await apiKeysResource.refetch();

    reset(form);
  };
</script>

<Card class="w-full max-w-xl">
  <CardHeader>
    <CardTitle>api keys</CardTitle>
  </CardHeader>
  <CardContent class="flex gap-2">
    <div class="grid grid-cols-1 gap-4">
      {#if apiKeysResource.loading}
        <p>loading api keys...</p>
      {:else if apiKeysResource.error}
        <p>error: {apiKeysResource.error.message}</p>
      {:else}
        {#each apiKeysResource.current?.data || [] as apiKey (apiKey.id)}
          <div class="flex flex-row items-center gap-2">
            <p>{apiKey.name} - {apiKey.start}...</p>
            <AlertDialog.Root>
              <AlertDialog.Trigger
                class={buttonVariants({ variant: "destructive", size: "icon" })}
              >
                <Trash2 />
              </AlertDialog.Trigger>
              <AlertDialog.Content>
                <AlertDialog.Header>
                  <AlertDialog.Title
                    >are you sure you want to delete this api key ({apiKey.name})?</AlertDialog.Title
                  >
                  <AlertDialog.Description
                    >this api key will become unusable</AlertDialog.Description
                  >
                </AlertDialog.Header>
                <AlertDialog.Footer>
                  <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                  <AlertDialog.Action
                    onclick={async () => {
                      await session.authClient.apiKey.delete({
                        keyId: apiKey.id,
                      });

                      await apiKeysResource.refetch();
                    }}
                    class={buttonVariants({ variant: "destructive" })}
                    >Continue</AlertDialog.Action
                  >
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </div>
        {/each}
      {/if}
      <Separator />
      <Form of={form} onsubmit={submitForm}>
        <Field of={form} path={["name"]}>
          {#snippet children(field)}
            <TextInput
              {...field.props}
              input={field.input}
              errors={field.errors}
              type="text"
              label="create a new api key"
              placeholder="my beautiful api key"
              required
            />
          {/snippet}
        </Field>
        <br />
        <Button
          type="submit"
          disabled={!form.isDirty || !form.isValid || form.isSubmitting}
        >
          {#if form.isSubmitting}
            <LoaderCircle class="animate-spin" />
          {/if}
          create
        </Button>
      </Form>
    </div>
  </CardContent>
  <CardFooter>
    <p class="text-sm">
      this will be shown in the bottom right corner of videos, and in the end
      credits.
    </p>
  </CardFooter>
</Card>
