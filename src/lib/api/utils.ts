import { getRequestEvent } from "$app/server";
import { error } from "@sveltejs/kit";

export function gurkanOnlyGuard() {
	const ev = getRequestEvent();

	if (!ev.locals.user || ev.locals.user.id !== "RD12iPBWXphrrOjaRsdNRQCJOd6Z7nbQ") throw error(403);
}
