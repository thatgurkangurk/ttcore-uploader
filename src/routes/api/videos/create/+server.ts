import { gurkanOnlyApiKeyGuard } from "$lib/api/server-utils.server";
import { db } from "$lib/server/db/index.js";
import { video } from "$lib/server/db/schema/video.js";
import { error, json } from "@sveltejs/kit";
import * as z from "zod/v4";

import { CreateNewVideoSchema } from "../../../videos/schemas.js";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
	await gurkanOnlyApiKeyGuard(request.headers.get("x-api-key") || "");

	let body;
	try {
		body = await request.json();
	} catch {
		throw error(400, "Invalid JSON body provided.");
	}

	const parsed = z.safeParse(CreateNewVideoSchema, body);

	if (!parsed.success) {
		console.warn("validation failed:", parsed.error.message);

		return json(
			{
				success: false,
				message: "validation failed",
				errors: parsed.error.issues
			},
			{ status: 400 }
		);
	}

	const validData = parsed.data;

	try {
		const [created] = await db
			.insert(video)
			.values({
				title: validData.title
			})
			.returning();

		return json({ success: true, videoId: created.id }, { status: 201 });
	} catch (err) {
		console.error("db error while creating video:", err);

		return json(
			{
				success: false,
				message: "Failed to create video due to a server error."
			},
			{ status: 500 }
		);
	}
};
