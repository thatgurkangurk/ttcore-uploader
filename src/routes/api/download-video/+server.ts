import { error } from "@sveltejs/kit";
import * as v from "valibot";

const urlSchema = v.pipe(v.string("please provide a url"), v.url("please provide a valid url"));

export async function GET({ url, locals }) {
	if (!locals.user)
		throw error(401, {
			message: "please sign in to continue"
		});

	const rawVideoUrl = url.searchParams.get("videoUrl");

	const validationResult = v.safeParse(urlSchema, rawVideoUrl);

	if (!validationResult.success) {
		const errorMessage = validationResult.issues[0].message;
		throw error(400, errorMessage);
	}

	const videoUrl = validationResult.output;

	try {
		const videoRes = await fetch(videoUrl);

		if (!videoRes.ok) {
			console.log(videoRes.statusText);
			throw error(videoRes.status, "failed to fetch the actual video file");
		}

		const headers = new Headers(videoRes.headers);
		headers.set("Content-Disposition", 'attachment; filename="medal-clip.mp4"');

		return new Response(videoRes.body, {
			status: 200,
			headers: headers
		});
	} catch (err) {
		console.error("clip proxy error:", err);
		throw error(500, "failed to download the clip");
	}
}
