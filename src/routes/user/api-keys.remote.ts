import { getRequestEvent, query } from "$app/server";
import { authGuard } from "$lib/api/utils";
import { auth } from "$lib/server/auth";

export const getApiKeys = query(async () => {
	authGuard();

	const res = await auth.api.listApiKeys({
		headers: getRequestEvent().request.headers
	});

	return res;
});
