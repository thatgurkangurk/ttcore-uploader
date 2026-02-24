import { pgTable } from "drizzle-orm/pg-core";

export const video = pgTable("video", (t) => ({
	id: t.serial().primaryKey()
}));
