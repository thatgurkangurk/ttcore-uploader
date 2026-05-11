import * as v from "valibot";

export const SongsSchema = v.pipe(
	v.array(v.string()),
	v.maxLength(12, "why do you have more than 12 songs in one video")
);
