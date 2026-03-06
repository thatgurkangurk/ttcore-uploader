import type { LayoutServerLoad } from "./$types";

export const load = (async (ev) => {
	const session =
		ev.locals.session && ev.locals.user
			? {
					session: ev.locals.session,
					user: ev.locals.user
				}
			: null;

	return {
		session
	};
}) satisfies LayoutServerLoad;
