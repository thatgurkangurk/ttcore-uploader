import { invalidateAll } from "$app/navigation";
import { page } from "$app/state";
import type { User, Session, auth } from "$lib/server/auth.js";
import type { SocialProvider } from "better-auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { apiKeyClient } from "@better-auth/api-key/client";
import { createAuthClient } from "better-auth/svelte";
import { createContext } from "svelte";
import { fromStore } from "svelte/store";

export class SessionState {
	current: {
		session: Session;
		user: User;
	} | null = $state(null);
	public readonly authClient;

	constructor(
		sessionData: {
			session: Session;
			user: User;
		} | null
	) {
		this.current = sessionData as { user: User; session: Session } | null;
		this.authClient = createAuthClient({
			plugins: [apiKeyClient(), inferAdditionalFields<typeof auth>()]
		});
		const rawSession = fromStore(this.authClient.useSession());

		$effect(() => {
			if (rawSession.current.isPending) return;
			this.current = rawSession.current.data as { user: User; session: Session } | null;
		});
	}

	async signOut() {
		const res = await this.authClient.signOut();
		await invalidateAll();
		return res;
	}

	async signInSocial(provider: SocialProvider) {
		return await this.authClient.signIn.social({
			provider: provider,
			callbackURL: page.url.pathname?.toString()
		});
	}
}

export const [useSession, setSession] = createContext<SessionState>();
