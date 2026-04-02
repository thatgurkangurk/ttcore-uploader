import { form, query } from "$app/server";
import { db } from "$lib/server/db";
import { profile } from "$lib/server/db/schema/profile";
import * as v from "valibot";

import { gurkanOnlyGuard } from "./utils";

export const getProfiles = query(async () => {
	gurkanOnlyGuard();
	const allProfiles = await db.query.profile.findMany();
	return allProfiles;
});

export const createProfile = form(
	v.object({
		line1: v.string(),
		line2: v.string()
	}),
	async (data) => {
		gurkanOnlyGuard();

		await db.insert(profile).values({
			line1: data.line1,
			line2: data.line2
		});

		await getProfiles().refresh();
	}
);
