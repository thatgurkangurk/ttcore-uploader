import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";
import { env as privateEnv } from "$env/dynamic/private";

export const env = createEnv({
	server: {
		DATABASE_URL: v.pipe(v.string(), v.url()),
		DISCORD_WEBHOOK_URL: v.optional(v.pipe(v.string(), v.url())),
		DISCORD_CLIENT_ID: v.string(),
		DISCORD_CLIENT_SECRET: v.string(),
		BETTER_AUTH_SECRET: v.string(),
		DOWNLOAD_URL: v.pipe(v.string(), v.url())
	},

	runtimeEnvStrict: {
		DATABASE_URL: privateEnv.DATABASE_URL,
		DISCORD_WEBHOOK_URL: privateEnv.DISCORD_WEBHOOK_URL,
		DISCORD_CLIENT_ID: privateEnv.DISCORD_CLIENT_ID,
		DISCORD_CLIENT_SECRET: privateEnv.DISCORD_CLIENT_SECRET,
		BETTER_AUTH_SECRET: privateEnv.BETTER_AUTH_SECRET,
		DOWNLOAD_URL: privateEnv.DOWNLOAD_URL
	},

	skipValidation: process.env.CI === "1"
});
