import { command, query } from "$app/server";
import { db } from "$lib/server/db";
import * as v from "valibot";
import { gurkanOnlyGuard } from "./utils";
import { serverSettings } from "$lib/server/db/schema/server-settings";
import { eq } from "drizzle-orm";
import { getServerSettings } from "$lib/server/server-settings";

export const getVideos = query(async () => {
	const allVideos = await db.query.video.findMany({
		orderBy: {
			createdAt: "asc"
		}
	});
	return allVideos;
});

export const getClipsForVideo = query(
	v.object({
		videoId: v.string()
	}),
	async (params) => {
		gurkanOnlyGuard();

		const allClips = await db.query.clip.findMany({
			where: {
				videoId: params.videoId
			},
			orderBy: {
				createdAt: "asc"
			},
			with: {
				creator: true
			}
		});

		return allClips;
	}
);

export const getSubmissionsOpen = query(async () => {
	gurkanOnlyGuard();
	const settings = await getServerSettings();

	return settings.submissionsOpen;
});

export const setSubmissionsOpen = command(
	v.object({
		submissionsOpen: v.boolean()
	}),
	async (data) => {
		gurkanOnlyGuard();
		await db
			.update(serverSettings)
			.set({
				submissionsOpen: data.submissionsOpen
			})
			.where(eq(serverSettings.id, 0));

		await getSubmissionsOpen().refresh();
	}
);
