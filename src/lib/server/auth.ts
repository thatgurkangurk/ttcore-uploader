import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/index.ts";
import { env } from "$env/dynamic/private";
import { apiKey } from "better-auth/plugins";

if (!env.DISCORD_CLIENT_ID) throw new Error("DISCORD_CLIENT_ID is not set");
if (!env.DISCORD_CLIENT_SECRET) throw new Error("DISCORD_CLIENT_SECRET is not set");

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg" // or "pg" or "mysql"
	}),
	plugins: [
		apiKey({
			apiKeyHeaders: ["x-api-key"]
		})
	],
	socialProviders: {
		discord: {
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,

			mapProfileToUser: async (profile) => {
				return {
					username: profile.username,
					name: profile.global_name
				};
			}
		}
	},
	user: {
		additionalFields: {
			username: {
				type: "string",
				unique: true,
				required: true
			}
		}
	}
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
