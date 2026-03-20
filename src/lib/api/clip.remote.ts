import { command } from "$app/server";
import { db } from "$lib/server/db";
import { clip } from "$lib/server/db/schema/clip";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import * as v from "valibot";

import { CreateNewClipSchema } from "../../routes/submit/schemas";
import { authGuard, gurkanOnlyGuard } from "./utils";
import { getClipsForVideo } from "./video.remote";

export const createNewClip = command(
	v.object({
		videoId: v.pipe(v.string(), v.ulid()),
		...CreateNewClipSchema.entries
	}),
	async (data) => {
		const { user } = authGuard();

		const queriedVideo = await db.query.video.findFirst({
			where: {
				id: data.videoId
			}
		});

		if (!queriedVideo?.submissionsOpen)
			throw error(423, {
				message: "sorry, but submissions are not open at the moment. check back later !"
			});

		await db.insert(clip).values({
			createdById: user.id,
			url: data.url,
			videoId: data.videoId,
			title: data.title
		});
	}
);

export const setClipSelected = command(
	v.object({
		clipId: v.string(),
		selected: v.boolean()
	}),
	async (data) => {
		gurkanOnlyGuard();

		const queriedClip = await db.query.clip.findFirst({
			where: {
				id: data.clipId
			}
		});

		if (!queriedClip)
			throw error(404, {
				message: "that clip was not found"
			});

		await db
			.update(clip)
			.set({
				selected: data.selected
			})
			.where(eq(clip.id, data.clipId));

		await getClipsForVideo({
			videoId: queriedClip.videoId
		}).refresh();
	}
);
