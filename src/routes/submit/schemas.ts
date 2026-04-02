import * as v from "valibot";

export const CreateNewClipSchema = v.object({
	title: v.pipe(
		v.string("please provide a title"),
		v.minLength(4, "please provide a title longer than 4 characters"),
		v.maxLength(48, "please provide a title shorter than 48 characters")
	),
	profileOverride: v.nullable(v.pipe(v.string(), v.uuid())),
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
	)
});
