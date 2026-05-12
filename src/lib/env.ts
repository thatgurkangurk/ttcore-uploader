import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { env as privateEnv } from "$env/dynamic/private";

export const env = createEnv({
	server: {
		DATABASE_URL: z.url(),
		DISCORD_WEBHOOK_URL: z.url().optional(),
		DISCORD_CLIENT_ID: z.string(),
		DISCORD_CLIENT_SECRET: z.string(),
		BETTER_AUTH_SECRET: z.string(),
		DOWNLOAD_URL: z.url()
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
