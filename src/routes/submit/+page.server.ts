import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getServerSettings } from "$lib/server/server-settings";
import { db } from "$lib/server/db";

async function getSubmittersForVideo(videoId: number) {
	const res = await db.query.clip.findMany({
		where: {
			videoId: videoId
		},
		columns: {
			createdAt: false,
			createdById: false,
			id: false,
			selected: false,
			title: false,
			url: false,
			videoId: false
		},
		with: {
			creator: {
				columns: {
					id: true,
					name: true,
					username: true
				}
			}
		}
	});

	const unique = new Map<string, NonNullable<(typeof res)[number]["creator"]>>();

	for (const row of res) {
		if (row.creator) {
			unique.set(row.creator.id, row.creator);
		}
	}
	return [...unique.values()];
}

export const load = (async (ev) => {
	if (!ev.locals.user)
		throw error(403, {
			message: "please sign in to continue"
		});

	const serverSettings = await getServerSettings();

	const { submissionsOpen, videoId: currentVideo } = serverSettings;

	const submitters = submissionsOpen ? [] : await getSubmittersForVideo(currentVideo);

	return {
		currentVideo,
		submissionsOpen,
		submitters
	};
}) satisfies PageServerLoad;
