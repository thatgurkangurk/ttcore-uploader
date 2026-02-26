import { query } from "$app/server";
import { db } from "$lib/server/db";
import * as v from "valibot";

export const getClipsForVideo = query(
	v.object({
		videoId: v.number()
	}),
	async (params) => {
		const allClips = await db.query.clip.findMany({
			where: {
				videoId: params.videoId
			},
			with: {
				creator: true
			}
		});

		return allClips;
	}
);
