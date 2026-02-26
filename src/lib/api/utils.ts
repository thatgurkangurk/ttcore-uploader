import { getRequestEvent } from "$app/server";
import { error } from "@sveltejs/kit";

export const GURKANS_USER_ID = "RD12iPBWXphrrOjaRsdNRQCJOd6Z7nbQ";

export function gurkanOnlyGuard() {
	const ev = getRequestEvent();

	if (!ev.locals.user || ev.locals.user.id !== GURKANS_USER_ID) throw error(403);
}
