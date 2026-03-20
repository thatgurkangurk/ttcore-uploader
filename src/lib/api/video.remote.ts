import { command, form, query } from "$app/server";
import { db } from "$lib/server/db";
import { video } from "$lib/server/db/schema/video";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import * as v from "valibot";

import { CreateNewVideoSchema } from "../../routes/videos/schemas";
import { gurkanOnlyGuard } from "./utils";

export const createVideo = form(CreateNewVideoSchema, async (data) => {
	gurkanOnlyGuard();

	await db.insert(video).values({
		title: data.title
	});

	await getVideos().refresh();
});

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
