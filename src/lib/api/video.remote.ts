import { command, query } from "$app/server";
import { db } from "$lib/server/db";
import * as v from "valibot";
import { gurkanOnlyGuard } from "./utils";
import { serverSettings } from "$lib/server/db/schema/server-settings";
import { eq } from "drizzle-orm";
import { getServerSettings } from "$lib/server/server-settings";
import { error } from "@sveltejs/kit";
import { video } from "$lib/server/db/schema/video";

export const getVideos = query(async () => {
	const allVideos = await db.query.video.findMany({
		orderBy: {
			createdAt: "asc"
		}
	});
	return allVideos;
});

export const getVideoById = query(
	v.object({
		videoId: v.string()
	}),
	async (data) => {
		gurkanOnlyGuard();
		const queriedVideo = await db.query.video.findFirst({
			where: {
				id: data.videoId
			}
		});

		if (!queriedVideo) error(404);

		return queriedVideo;
	}
);

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

export const getSubmissionsOpen = query(
	v.object({
		videoId: v.string()
	}),
	async (data) => {
		gurkanOnlyGuard();
		const queriedVideo = await db.query.video.findFirst({
			where: {
				id: data.videoId
			}
		});

		if (!queriedVideo) error(404);

		return queriedVideo.submissionsOpen;
	}
);

export const setSubmissionsOpen = command(
	v.object({
		videoId: v.string(),
		submissionsOpen: v.boolean()
	}),
	async (data) => {
		gurkanOnlyGuard();
		await db
			.update(video)
			.set({
				submissionsOpen: data.submissionsOpen
			})
			.where(eq(video.id, data.videoId));

		await getSubmissionsOpen({
			videoId: data.videoId
		}).refresh();
		await getVideoById({
			videoId: data.videoId
		}).refresh();
		await getVideos().refresh();
	}
);
