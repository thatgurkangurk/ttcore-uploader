import * as v from "valibot";
import { SongsSchema } from "./song";

export const ClipTitleSchema = v.pipe(
	v.string("please provide a title"),
	v.minLength(4, "please provide a title longer than 4 characters"),
	v.maxLength(48, "please provide a title shorter than 48 characters")
);

export const ClipUrlSchema = v.pipe(
	v.string("please provide a url"),
	v.url("please provide a valid url"),
	v.check((value) => {
		try {
			const parsed = new URL(value);
			return parsed.hostname !== "cdn.discordapp.com";
		} catch {
			return false;
		}
	}, "please do not use discord cdn links"),
	v.regex(/\.(mp4|webm|mov|mkv|avi)$/i, "url must be a valid video")
);

export const ClipNoteSchema = v.pipe(
	v.string(),
	v.minLength(4, "please provide a note longer than 4 characters"),
	v.maxLength(1024, "please provide a note shorter than 1024 characters")
);

export const CreateNewClipSchema = v.object({
	title: ClipTitleSchema,
	profileOverride: v.optional(
		v.union([
			v.pipe(
				v.literal(""),
				v.transform(() => undefined)
			),
			v.pipe(v.string(), v.uuid())
		])
	),

	userOverride: v.optional(
		v.union([
			v.pipe(
				v.literal(""),
				v.transform(() => undefined)
			),
			v.pipe(v.string(), v.minLength(1))
		])
	),
	url: ClipUrlSchema,
	note: v.optional(ClipNoteSchema),
	songs: v.optional(SongsSchema, [])
});

export const CreateNewClipArgs = v.object({
	videoId: v.pipe(v.string(), v.ulid()),
	...CreateNewClipSchema.entries
});

export const UpdateClipArgs = v.object({
	clipId: v.pipe(v.string()),
	title: v.optional(ClipTitleSchema),
	note: v.optional(
		v.pipe(
			// allow either the valid note schema OR an exact empty string
			v.union([ClipNoteSchema, v.literal("")]),
			// treat empty string as undefined
			v.transform((val) => (val === "" ? undefined : val))
		)
	),
	songs: v.optional(SongsSchema, [])
});
