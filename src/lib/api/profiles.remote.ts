import { query } from "$app/server";
import { db } from "$lib/server/db";

export const getProfiles = query(async () => {
	const allProfiles = await db.query.profile.findMany();
	return allProfiles;
});
