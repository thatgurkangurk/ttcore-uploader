import * as v from "valibot";

export const SongsSchema = v.pipe(
	v.array(
		v.pipe(
			v.string(),
			v.nonEmpty("please provide a value"),
			v.minLength(8, "please provide a value longer than 8 characters"),
			v.maxLength(64, "please provide a value shorter than 64 characters")
		)
	),
	v.maxLength(12, "why do you have more than 12 songs in one video")
);
