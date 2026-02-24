import * as authSchema from "./schema/auth.js";
import * as serverSettingsSchema from "./schema/server-settings.js";

export const schema = { ...authSchema, ...serverSettingsSchema };
