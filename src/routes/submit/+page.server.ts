import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getServerSettings } from "$lib/server/server-settings";

export const load = (async (ev) => {
	if (!ev.locals.user)
		throw error(403, {
			message: "please sign in to continue"
		});

	const serverSettings = await getServerSettings();

	if (!serverSettings.submissionsOpen)
		throw error(423, {
			message: "sorry, but submissions are not open at the moment. check back later !"
		});

	return {};
}) satisfies PageServerLoad;
