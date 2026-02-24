import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getServerSettings } from "$lib/server/server-settings";
import { db } from "$lib/server/db";

export const load = (async (ev) => {
	if (!ev.locals.user)
		throw error(403, {
			message: "please sign in to continue"
		});

	if (ev.locals.user.id !== "RD12iPBWXphrrOjaRsdNRQCJOd6Z7nbQ")
		throw error(403, {
			message: "sorry, but you cannot access this page"
		});

	const serverSettings = await getServerSettings();

	if (!serverSettings.submissionsOpen)
		throw error(423, {
			message: "sorry, but submissions are not open at the moment. check back later !"
		});

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
