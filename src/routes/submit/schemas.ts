import * as v from "valibot";

export const ClipTitleSchema = v.pipe(
	v.string("please provide a title"),
	v.minLength(4, "please provide a title longer than 4 characters"),
	v.maxLength(48, "please provide a title shorter than 48 characters")
);

export const CreateNewClipSchema = v.object({
	title: ClipTitleSchema,
	profileOverride: v.nullish(v.pipe(v.string(), v.uuid())),
	userOverride: v.nullish(v.pipe(v.string())),
	url: v.pipe(
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
	),
	songs: v.pipe(
		v.array(v.string()),
		v.maxLength(12, "why do you have more than 12 songs in one video")
	)
});
