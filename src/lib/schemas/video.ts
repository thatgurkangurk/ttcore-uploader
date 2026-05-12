import * as z from "zod/v4";
import { VideoMessageSchema } from "../../routes/videos/schemas";

export const SetVideoMessageSchema = z.object({
	videoId: z.string(),
	newMessage: VideoMessageSchema
});
