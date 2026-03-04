import { pgTable } from "drizzle-orm/pg-core";
import { ulid } from "ulid";

export const video = pgTable("video", (t) => ({
	id: t
		.text()
		.primaryKey()
		.$defaultFn(() => ulid()),
	title: t.text().notNull().unique(),
	submissionsOpen: t.boolean("submissions_open").notNull().default(true),
	createdAt: t.timestamp("created_at").defaultNow().notNull()
}));
