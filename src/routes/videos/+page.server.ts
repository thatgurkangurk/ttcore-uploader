import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getServerSettings } from "$lib/server/server-settings";
import { db } from "$lib/server/db";
import { GURKANS_USER_ID } from "$lib/api/utils";

export const load = (async (ev) => {
	if (!ev.locals.user)
		throw error(403, {
			message: "please sign in to continue"
		});

	if (ev.locals.user.id !== GURKANS_USER_ID)
		throw error(403, {
			message: "sorry, but you cannot access this page"
		});

	const serverSettings = await getServerSettings();

	const currentVideo = serverSettings.videoId;

	const allVideos = await db.query.video.findMany({
		columns: {
			id: true
		}
	});

	return {
		currentVideo,
		allVideos
	};
}) satisfies PageServerLoad;
