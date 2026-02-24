import { db } from "./db";
import { serverSettings } from "./db/schema/server-settings";

export type ServerSettings = typeof serverSettings.$inferSelect;

export async function getServerSettings(): Promise<ServerSettings> {
	const settings = await db.query.serverSettings.findFirst({
		where: (table, { eq }) => eq(table.id, 0)
	});

	if (!settings) throw new Error("you forgot to create a server settings row");

	return settings;
}
