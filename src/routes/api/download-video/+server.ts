import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";
import * as v from "valibot";

const urlSchema = v.pipe(
	v.string("please provide a url"),
	v.url("please provide a valid url"),
	v.check((value) => {
		try {
			const parsed = new URL(value);
			return parsed.hostname === "medal.tv";
		} catch {
			return false;
		}
	}, "please provide a medal link")
);

export async function GET({ url }) {
	const rawVideoUrl = url.searchParams.get("videoUrl");

	const validationResult = v.safeParse(urlSchema, rawVideoUrl);

	if (!validationResult.success) {
		const errorMessage = validationResult.issues[0].message;
		throw error(400, errorMessage);
	}

	const videoUrl = validationResult.output;

	try {
		const targetUrl = new URL("/api/clip", env.DOWNLOAD_URL);

		const apiRes = await fetch(targetUrl, {
			body: JSON.stringify({ url: videoUrl }),
			headers: { "Content-Type": "application/json" },
			method: "POST"
		});

		if (!apiRes.ok) {
			console.log(apiRes.statusText);
			throw error(apiRes.status, "failed to fetch the clip metadata");
		}

		const json = await apiRes.json();

		if (!json.src) {
			throw error(500, "api did not return a valid video source link");
		}

		const videoRes = await fetch(json.src);

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
