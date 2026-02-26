import { query } from "$app/server";
import { db } from "$lib/server/db";
import * as v from "valibot";
import { gurkanOnlyGuard } from "./utils";

export const getClipsForVideo = query(
	v.object({
		videoId: v.number()
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
