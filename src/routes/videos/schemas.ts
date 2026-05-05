import * as v from "valibot";

export const VideoMessageSchema = v.pipe(
	v.string("please provide a string"),
	v.minLength(4, "the message has to be longer than 4 characters"),
	v.maxLength(512, "the message has to be shorter than 512 characters")
);

export const CreateNewVideoSchema = v.object({
	title: v.pipe(
		v.string("please provide a string"),
		v.minLength(4, "the title has to be longer than 4 characters"),
		v.maxLength(48, "the title has to be shorter than 48 characters")
	),
	message: v.optional(VideoMessageSchema)
});
