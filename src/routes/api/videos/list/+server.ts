import { gurkanOnlyApiKeyGuard } from "$lib/api/server-utils.server";
import { db } from "$lib/server/db";
import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (ev) => {
	await gurkanOnlyApiKeyGuard(ev.request.headers.get("x-api-key") || "");

	const allVideos = await db.query.video.findMany({
		orderBy: {
			createdAt: "asc"
		},
		columns: {
			id: true,
			title: true,
			submissionsOpen: true
		}
	});

	return json({
		videos: allVideos
	});
};
