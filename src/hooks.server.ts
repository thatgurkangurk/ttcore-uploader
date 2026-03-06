import { auth } from "$lib/server/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { runWithEndpointContext } from "@better-auth/core/context";

export async function handle({ event, resolve }) {
	const context = await auth.$context;
	const session = await runWithEndpointContext(
		{
			context: context
		},
		async () => {
			const session = await auth.api.getSession({
				headers: event.request.headers
			});

			return session;
		}
	);

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
}
