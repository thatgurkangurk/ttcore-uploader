import { auth } from "$lib/server/auth";
import { error } from "@sveltejs/kit";

import { GURKANS_USER_ID } from "./utils";

export async function gurkanOnlyApiKeyGuard(key: string) {
	const data = await auth.api.verifyApiKey({
		body: {
			key: key
		}
	});

	if (!data.valid) {
		error(403, {
			message: data.error?.code || "invalid api key"
		});
	}

	if (data.key?.userId !== GURKANS_USER_ID)
		error(403, {
			message: "you do not have permission to do this"
		});
}
