<script lang="ts">
  import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogHeader,
    AlertDialogCancel,
  } from "$lib/components/ui/alert-dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card/index.js";
  import Star from "@lucide/svelte/icons/star";
  import { deleteClip, setClipSelected } from "$lib/api/clip.remote";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";

  type Props = {
    clip: {
      id: string;
      createdAt: Date;
      createdById: string;
      videoId: string;
      url: string;
      title: string;
      selected: boolean;
      overriddenProfileDataId: string | null;
      creator: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        admin: boolean;
      } | null;
    };
    submissionsOpen: boolean;
  };

  let { clip, submissionsOpen }: Props = $props();

  let deleting = $state(false);
  let dialogOpen = $state(false);
</script>

<Card class="h-full w-full">
  <CardHeader>
    <CardTitle class="text-xl">{clip.title}</CardTitle>
  </CardHeader>
  <CardContent>
    <div class="aspect-video w-full overflow-hidden rounded-lg">
      <!-- svelte-ignore a11y_media_has_caption -->
      <video
        class=" h-40 w-full object-cover"
        src={clip.url}
        controls
        preload="none"
      ></video>
    </div>
  </CardContent>
  <CardFooter class="grid grid-cols-1 gap-1">
    <p>
      created by <span>{clip.creator!.name}</span>
    </p>
    <div class="flex flex-row gap-2">
      <Button
        disabled={!submissionsOpen}
        onclick={async () =>
          await setClipSelected({
            clipId: clip.id,
            selected: !clip.selected,
          })}
        variant="outline"
        size="icon"
      >
        <Star {...clip.selected ? { fill: "#ffffff" } : {}} />
      </Button>
      <AlertDialog bind:open={dialogOpen}>
        <AlertDialogTrigger
          disabled={!submissionsOpen}
          onclick={() => (dialogOpen = true)}
          class={buttonVariants({ variant: "destructive" })}
        >
          delete
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              are you sure you want to delete "{clip.title}"?
            </AlertDialogTitle>
            <AlertDialogDescription>
              this clip will permanently be gone. you probably should just
              unselect it
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onclick={() => (dialogOpen = false)}
              >no, cancel</AlertDialogCancel
            >
            <AlertDialogAction
              disabled={deleting}
              onclick={async () => {
                deleting = true;
                await deleteClip({ clipId: clip.id });
                deleting = false;
                dialogOpen = false;
              }}
            >
              {#if deleting}
                <LoaderCircle class="animate-spin" />
              {/if}
              yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </CardFooter>
</Card>
