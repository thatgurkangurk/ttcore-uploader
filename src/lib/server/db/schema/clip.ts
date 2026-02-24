import { pgTable } from "drizzle-orm/pg-core";

export const clip = pgTable("clip", (t) => ({
	id: t.uuid().defaultRandom().primaryKey(),
	createdById: t.text("created_by_id").notNull(),
	videoId: t.integer("video_id").notNull(),
	url: t.text("url").notNull().unique(),
	title: t.text().notNull()
}));
