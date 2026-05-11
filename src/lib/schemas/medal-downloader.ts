import * as v from "valibot";

export const MedalDownloaderSchema = v.object({
	url: v.pipe(
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
	)
});
