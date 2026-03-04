import { pgTable } from "drizzle-orm/pg-core";

export const video = pgTable("video", (t) => ({
	id: t.serial().primaryKey(),
	title: t.text().notNull().unique(),
	submissionsOpen: t.boolean("submissions_open").notNull().default(true)
}));
