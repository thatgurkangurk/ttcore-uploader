import { pgTable } from "drizzle-orm/pg-core";

export const serverSettings = pgTable("server_settings", (t) => ({
	id: t.serial().primaryKey(),
	videoId: t.integer("video_id").unique().notNull(),
	submissionsOpen: t.boolean("submissions_open").notNull()
}));
