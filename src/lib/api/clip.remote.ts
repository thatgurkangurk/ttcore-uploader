import { command, getRequestEvent } from "$app/server";
import { error } from "@sveltejs/kit";
import { CreateNewClipSchema } from "../../routes/submit/schemas";
import { getServerSettings } from "$lib/server/server-settings";
import { db } from "$lib/server/db";
import { clip } from "$lib/server/db/schema/clip";
import * as v from "valibot";
import { gurkanOnlyGuard } from "./utils";
import { getClipsForVideo } from "./video.remote";
import { eq } from "drizzle-orm";

export const createNewClip = command(CreateNewClipSchema, async (data) => {
	const event = getRequestEvent();

	if (!event.locals.user)
		throw error(403, {
			message: "please sign in to continue"
		});

	const serverSettings = await getServerSettings();

	if (!serverSettings.submissionsOpen)
		throw error(423, {
			message: "sorry, but submissions are not open at the moment. check back later !"
		});

	await db.insert(clip).values({
		createdById: event.locals.user.id,
		url: data.url,
		videoId: serverSettings.videoId,
		title: data.title
	});
});

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
