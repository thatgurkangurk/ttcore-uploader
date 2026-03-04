import * as v from "valibot";

export const CreateNewVideoSchema = v.object({
	title: v.pipe(
		v.string("please provide a string"),
		v.minLength(4, "the title has to be longer than 4 characters"),
		v.maxLength(48, "the title has to be shorter than 48 characters")
	)
});
