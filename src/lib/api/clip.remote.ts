import { command, form } from "$app/server";
import { env } from "$lib/env";
import { db } from "$lib/server/db";
import { clip } from "$lib/server/db/schema/clip";
import { EmbedBuilder } from "@discordjs/builders";
import { error, invalid } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import * as v from "valibot";

import { ClipTitleSchema, CreateNewClipArgs, UpdateClipArgs } from "$lib/schemas/clip.js";
import { SongsSchema } from "$lib/schemas/song.js";
import { authGuard, adminOnlyGuard } from "./utils";
import { getClipsForVideo, getMyClipsForVideo } from "./video.remote";

type Video = {
	title: string;
	id: string;
	createdAt: Date;
	submissionsOpen: boolean;
};

function createClipSubmittedEmbed(
	clip: v.InferOutput<typeof CreateNewClipArgs>,
	video: Video,
	authorName: string,
	overridden: { user: boolean; profile: boolean }
) {
	const embed = new EmbedBuilder();

	embed.setTitle(`new clip for ${video.title}`);
	embed.setDescription(clip.title);
	embed.addFields([
		{
			name: "author",
			value: authorName
		},
		{
			name: "overriden user",
			value: overridden.user ? "yes" : "no"
		},
		{
			name: "overriden profile",
			value: overridden.profile ? "yes" : "no"
		}
	]);

	embed.setTimestamp();
	embed.setColor(0x7289da);

	return embed;
}

export const createNewClip = form(CreateNewClipArgs, async (data) => {
	console.table(data);

	const { user } = authGuard();

	const queriedVideo = await db.query.video.findFirst({
		where: {
			id: data.videoId
		}
	});

	if (!queriedVideo?.submissionsOpen)
		invalid("sorry, but submissions are not open at the moment. check back later !");

	const isOverridingUserId = user.admin && data.userOverride != undefined;

	const createdById = isOverridingUserId ? data.userOverride : user.id;

	const isOverridingProfile = user.admin && data.profileOverride != undefined;

	if (!createdById) {
		throw new Error("createdById is null/undefined - this should never happen");
	}

	console.log("Overriding user id:", isOverridingUserId);
	console.log("createdById:", createdById);

	await db.insert(clip).values({
		createdById,
		url: data.url,
		videoId: data.videoId,
		title: data.title,
		overriddenProfileDataId: isOverridingProfile ? data.profileOverride : null,
		songs: data.songs,
		note: data.note
	});

	const embed = createClipSubmittedEmbed(data, queriedVideo, user.name, {
		profile: isOverridingProfile,
		user: isOverridingUserId
	});

	if (env.DISCORD_WEBHOOK_URL) {
		await fetch(env.DISCORD_WEBHOOK_URL, {
			method: "post",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				embeds: [embed.toJSON()]
			})
		});
	}
});

export const updateClip = form(UpdateClipArgs, async (data) => {
	const { user } = authGuard();

	console.log(data);

	const { clipId, title, note, songs } = data;

	console.log(songs);

	const [updatedClip] = await db
		.update(clip)
		.set({
			title,
			note: note ?? null,
			songs
		})
		.where(and(eq(clip.id, clipId), eq(clip.createdById, user.id)))
		.returning();

	if (!updatedClip) {
		invalid("that clip was not found");
	}

	await getClipsForVideo({
		videoId: updatedClip.videoId
	}).refresh();

	await getMyClipsForVideo({
		videoId: updatedClip.videoId
	}).refresh();
});

export const deleteClip = command(
	v.object({
		clipId: v.string()
	}),
	async (data) => {
		adminOnlyGuard();

		const queriedClip = await db.query.clip.findFirst({
			where: {
				id: data.clipId
			}
		});

		if (!queriedClip)
			throw error(404, {
				message: "that clip was not found"
			});

		await db.delete(clip).where(eq(clip.id, data.clipId));

		await getClipsForVideo({
			videoId: queriedClip.videoId
		}).refresh();
	}
);

export const setNewClipSongs = command(
	v.object({
		clipId: v.string(),
		songs: SongsSchema
	}),
	async (data) => {
		const { user } = authGuard();

		const queriedClip = await db.query.clip.findFirst({
			where: {
				id: data.clipId,
				createdById: user.id
			}
		});

		if (!queriedClip)
			throw error(404, {
				message: "that clip was not found"
			});

		await db
			.update(clip)
			.set({
				songs: data.songs
			})
			.where(eq(clip.id, data.clipId));

		await getClipsForVideo({
			videoId: queriedClip.videoId
		}).refresh();
		await getMyClipsForVideo({
			videoId: queriedClip.videoId
		}).refresh();
	}
);

export const setNewClipTitle = command(
	v.object({
		clipId: v.string(),
		title: ClipTitleSchema
	}),
	async (data) => {
		const { user } = authGuard();

		const queriedClip = await db.query.clip.findFirst({
			where: {
				id: data.clipId,
				createdById: user.id
			}
		});

		if (!queriedClip)
			throw error(404, {
				message: "that clip was not found"
			});

		await db
			.update(clip)
			.set({
				title: data.title
			})
			.where(eq(clip.id, data.clipId));

		await getClipsForVideo({
			videoId: queriedClip.videoId
		}).refresh();
		await getMyClipsForVideo({
			videoId: queriedClip.videoId
		}).refresh();
	}
);

export const setClipSelected = command(
	v.object({
		clipId: v.string(),
		selected: v.boolean()
	}),
	async (data) => {
		adminOnlyGuard();

		const queriedClip = await db.query.clip.findFirst({
			where: {
				id: data.clipId
			}
		});

		if (!queriedClip)
			throw error(404, {
				message: "that clip was not found"
			});

		await db
			.update(clip)
			.set({
				selected: data.selected
			})
			.where(eq(clip.id, data.clipId));

		await getClipsForVideo({
			videoId: queriedClip.videoId
		}).refresh();
	}
);
