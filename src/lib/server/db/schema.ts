import * as authSchema from "./schema/auth.js";
import * as clipSchema from "./schema/clip.js";
import * as serverSettingsSchema from "./schema/server-settings.js";
import * as videoSchema from "./schema/video.js";

export const schema = { ...authSchema, ...clipSchema, ...serverSettingsSchema, ...videoSchema };
