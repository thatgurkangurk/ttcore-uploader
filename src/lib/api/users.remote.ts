import { query } from "$app/server";
import { db } from "$lib/server/db";

import { adminOnlyGuard } from "./utils";

export const getUsers = query(async () => {
	adminOnlyGuard();
	const allUsers = await db.query.user.findMany({
		columns: {
			id: true,
			username: true,
			name: true,
			email: true
		}
	});
	return allUsers;
});
