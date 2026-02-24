import { command, getRequestEvent } from "$app/server";
import { error } from "@sveltejs/kit";
import { CreateNewClipSchema } from "../../routes/submit/schemas";
import { getServerSettings } from "$lib/server/server-settings";
import { db } from "$lib/server/db";
import { clip } from "$lib/server/db/schema/clip";

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
