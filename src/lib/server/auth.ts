import { getRequestEvent } from "$app/server";
import { env } from "$lib/env";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { apiKey } from "better-auth/plugins";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { schema } from "./db/schema";

import { db } from "./db/index.ts";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg", // or "pg" or "mysql"
		schema: schema
	}),
	plugins: [
		apiKey({
			apiKeyHeaders: ["x-api-key"]
		}),
		sveltekitCookies(getRequestEvent)
	],
	socialProviders: {
		discord: {
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,

			mapProfileToUser: async (profile) => {
				return {
					username: profile.username,
					name: profile.global_name || profile.username
				};
			}
		}
	},
	user: {
		additionalFields: {
			username: {
				type: "string",
				unique: true,
				required: true,
				input: false
			},
			admin: {
				type: "boolean",
				required: true,
				defaultValue: false,
				input: false
			}
		}
	},
	secret: env.BETTER_AUTH_SECRET
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
