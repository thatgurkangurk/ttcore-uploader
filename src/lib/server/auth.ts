import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/index.ts";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg" // or "pg" or "mysql"
	})
	//... the rest of your config
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
