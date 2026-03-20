import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

async function getSubmittersForVideo(videoId: string) {
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

	const queriedVideo = await db.query.video.findFirst({
		where: {
			id: ev.params.videoId
		}
	});

	if (!queriedVideo) throw error(404);

	const submitters = queriedVideo.submissionsOpen
		? []
		: await getSubmittersForVideo(queriedVideo.id);

	return {
		submissionsOpen: queriedVideo.submissionsOpen,
		submitters,
		details: queriedVideo
	};
}) satisfies PageServerLoad;
